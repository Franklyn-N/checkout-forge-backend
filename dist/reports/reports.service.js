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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReportsService = class ReportsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getVatReport(tenantId, from, to) {
        const orders = await this.prisma.order.findMany({
            where: {
                tenantId,
                status: 'PAID',
                createdAt: {
                    gte: from,
                    lte: to,
                },
            },
            include: {
                customer: true,
                items: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        const totalVat = orders.reduce((sum, order) => sum + order.vatAmount, 0);
        const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
        const totalNet = orders.reduce((sum, order) => sum + order.subtotal, 0);
        return {
            period: {
                from: from.toISOString(),
                to: to.toISOString(),
            },
            summary: {
                totalOrders: orders.length,
                totalNet,
                totalVat,
                totalGross: totalSales,
                currency: 'GBP',
            },
            orders: orders.map((order) => ({
                orderNumber: order.orderNumber,
                date: order.createdAt,
                customer: {
                    email: order.customer.email,
                    name: `${order.customer.firstName || ''} ${order.customer.lastName || ''}`.trim(),
                },
                net: order.subtotal,
                vat: order.vatAmount,
                gross: order.total,
            })),
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map