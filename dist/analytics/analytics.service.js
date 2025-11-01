"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AnalyticsService = class AnalyticsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async trackEvent(tenantId, dto) {
        return this.prisma.analyticsEvent.create({
            data: {
                tenantId,
                eventType: dto.eventType,
                orderId: dto.orderId,
                sessionId: dto.sessionId,
                pageUrl: dto.pageUrl,
                metadata: dto.metadata,
            },
        });
    }
    async getDashboard(tenantId, startDate, endDate) {
        const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const end = endDate || new Date();
        const [orders, pageViews, checkoutStarts, totalRevenue,] = await Promise.all([
            this.prisma.order.findMany({
                where: {
                    tenantId,
                    status: 'PAID',
                    createdAt: {
                        gte: start,
                        lte: end,
                    },
                },
            }),
            this.prisma.analyticsEvent.count({
                where: {
                    tenantId,
                    eventType: 'page_view',
                    createdAt: {
                        gte: start,
                        lte: end,
                    },
                },
            }),
            this.prisma.analyticsEvent.count({
                where: {
                    tenantId,
                    eventType: 'checkout_start',
                    createdAt: {
                        gte: start,
                        lte: end,
                    },
                },
            }),
            this.prisma.order.aggregate({
                where: {
                    tenantId,
                    status: 'PAID',
                    createdAt: {
                        gte: start,
                        lte: end,
                    },
                },
                _sum: {
                    total: true,
                },
            }),
        ]);
        const revenue = totalRevenue._sum.total || 0;
        const conversionCount = orders.length;
        const conversionRate = checkoutStarts > 0 ? (conversionCount / checkoutStarts) * 100 : 0;
        const aov = conversionCount > 0 ? revenue / conversionCount : 0;
        const revenueByDay = await this.getRevenueByDay(tenantId, start, end);
        const conversionsByDay = await this.getConversionsByDay(tenantId, start, end);
        return {
            summary: {
                revenue,
                orders: conversionCount,
                conversionRate: Math.round(conversionRate * 100) / 100,
                aov: Math.round(aov),
                pageViews,
                checkoutStarts,
            },
            charts: {
                revenueByDay,
                conversionsByDay,
            },
        };
    }
    async getRevenueByDay(tenantId, startDate, endDate) {
        const orders = await this.prisma.order.findMany({
            where: {
                tenantId,
                status: 'PAID',
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            select: {
                total: true,
                createdAt: true,
            },
        });
        const revenueMap = new Map();
        orders.forEach(order => {
            const date = order.createdAt.toISOString().split('T')[0];
            revenueMap.set(date, (revenueMap.get(date) || 0) + order.total);
        });
        return Array.from(revenueMap.entries())
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([date, revenue]) => ({ date, revenue }));
    }
    async getConversionsByDay(tenantId, startDate, endDate) {
        const orders = await this.prisma.order.findMany({
            where: {
                tenantId,
                status: 'PAID',
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            select: {
                createdAt: true,
            },
        });
        const conversionsMap = new Map();
        orders.forEach(order => {
            const date = order.createdAt.toISOString().split('T')[0];
            conversionsMap.set(date, (conversionsMap.get(date) || 0) + 1);
        });
        return Array.from(conversionsMap.entries())
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([date, conversions]) => ({ date, conversions }));
    }
    async getFunnel(tenantId, startDate, endDate) {
        const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const end = endDate || new Date();
        const where = {
            tenantId,
            createdAt: {
                gte: start,
                lte: end,
            },
        };
        const [pageViews, addToCarts, checkoutStarts, payments,] = await Promise.all([
            this.prisma.analyticsEvent.count({
                where: { ...where, eventType: 'page_view' },
            }),
            this.prisma.analyticsEvent.count({
                where: { ...where, eventType: 'add_to_cart' },
            }),
            this.prisma.analyticsEvent.count({
                where: { ...where, eventType: 'checkout_start' },
            }),
            this.prisma.order.count({
                where: {
                    tenantId,
                    status: 'PAID',
                    createdAt: {
                        gte: start,
                        lte: end,
                    },
                },
            }),
        ]);
        const calculateDropOff = (current, next) => {
            if (current === 0)
                return 0;
            return Math.round(((current - next) / current) * 100 * 100) / 100;
        };
        return [
            {
                step: 'Page Views',
                count: pageViews,
                dropOff: calculateDropOff(pageViews, addToCarts),
            },
            {
                step: 'Add to Cart',
                count: addToCarts,
                dropOff: calculateDropOff(addToCarts, checkoutStarts),
            },
            {
                step: 'Checkout Start',
                count: checkoutStarts,
                dropOff: calculateDropOff(checkoutStarts, payments),
            },
            {
                step: 'Payment Complete',
                count: payments,
                dropOff: 0,
            },
        ];
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map