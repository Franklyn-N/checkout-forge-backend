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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminService = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createProduct(tenantId, dto) {
        return this.prisma.product.create({
            data: {
                ...dto,
                tenantId,
            },
            include: {
                prices: true,
            },
        });
    }
    async updateProduct(tenantId, productId, dto) {
        const product = await this.prisma.product.findFirst({
            where: { id: productId, tenantId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return this.prisma.product.update({
            where: { id: productId },
            data: dto,
            include: {
                prices: true,
            },
        });
    }
    async deleteProduct(tenantId, productId) {
        const product = await this.prisma.product.findFirst({
            where: { id: productId, tenantId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        await this.prisma.product.delete({
            where: { id: productId },
        });
        return { message: 'Product deleted successfully' };
    }
    async getProduct(tenantId, productId) {
        const product = await this.prisma.product.findFirst({
            where: { id: productId, tenantId },
            include: {
                prices: true,
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async listProducts(tenantId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where: { tenantId },
                include: {
                    prices: true,
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.product.count({
                where: { tenantId },
            }),
        ]);
        return {
            data: products,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async createPrice(tenantId, dto) {
        const product = await this.prisma.product.findFirst({
            where: { id: dto.productId, tenantId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return this.prisma.price.create({
            data: {
                productId: dto.productId,
                amount: dto.amount,
                currency: dto.currency || 'GBP',
                type: dto.type,
                interval: dto.interval,
                intervalCount: dto.intervalCount,
                trialDays: dto.trialDays,
                isActive: dto.isActive !== undefined ? dto.isActive : true,
            },
        });
    }
    async updatePrice(tenantId, priceId, dto) {
        const price = await this.prisma.price.findFirst({
            where: {
                id: priceId,
                product: { tenantId },
            },
        });
        if (!price) {
            throw new common_1.NotFoundException('Price not found');
        }
        return this.prisma.price.update({
            where: { id: priceId },
            data: dto,
        });
    }
    async deletePrice(tenantId, priceId) {
        const price = await this.prisma.price.findFirst({
            where: {
                id: priceId,
                product: { tenantId },
            },
        });
        if (!price) {
            throw new common_1.NotFoundException('Price not found');
        }
        await this.prisma.price.delete({
            where: { id: priceId },
        });
        return { message: 'Price deleted successfully' };
    }
    async listOrders(tenantId, page = 1, limit = 20, status) {
        const skip = (page - 1) * limit;
        const where = { tenantId };
        if (status) {
            where.status = status;
        }
        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                include: {
                    customer: true,
                    items: {
                        include: {
                            product: true,
                            price: true,
                        },
                    },
                    refunds: true,
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.order.count({ where }),
        ]);
        return {
            data: orders,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getOrder(tenantId, orderId) {
        const order = await this.prisma.order.findFirst({
            where: { id: orderId, tenantId },
            include: {
                customer: true,
                items: {
                    include: {
                        product: true,
                        price: true,
                    },
                },
                refunds: true,
                checkoutPage: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    async processRefund(tenantId, dto, userId) {
        const order = await this.prisma.order.findFirst({
            where: { id: dto.orderId, tenantId },
            include: {
                refunds: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        const totalRefunded = order.refunds.reduce((sum, r) => sum + r.amount, 0);
        const remainingAmount = order.total - totalRefunded;
        if (dto.amount > remainingAmount) {
            throw new common_1.BadRequestException('Refund amount exceeds remaining order total');
        }
        const refund = await this.prisma.refund.create({
            data: {
                orderId: dto.orderId,
                amount: dto.amount,
                reason: dto.reason,
                processedBy: userId,
            },
        });
        const newTotalRefunded = totalRefunded + dto.amount;
        const newStatus = newTotalRefunded >= order.total ? 'REFUNDED' : 'PARTIALLY_REFUNDED';
        await this.prisma.order.update({
            where: { id: dto.orderId },
            data: { status: newStatus },
        });
        return refund;
    }
    async listSubscriptions(tenantId, page = 1, limit = 20, status) {
        const skip = (page - 1) * limit;
        const where = { tenantId };
        if (status) {
            where.status = status;
        }
        const [subscriptions, total] = await Promise.all([
            this.prisma.subscription.findMany({
                where,
                include: {
                    customer: true,
                    price: {
                        include: {
                            product: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.subscription.count({ where }),
        ]);
        return {
            data: subscriptions,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async cancelSubscription(tenantId, subscriptionId) {
        const subscription = await this.prisma.subscription.findFirst({
            where: { id: subscriptionId, tenantId },
        });
        if (!subscription) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        return this.prisma.subscription.update({
            where: { id: subscriptionId },
            data: {
                status: 'CANCELED',
                canceledAt: new Date(),
                cancelAtPeriodEnd: true,
            },
        });
    }
    async getDunningDashboard(tenantId) {
        const pastDueSubscriptions = await this.prisma.subscription.findMany({
            where: {
                tenantId,
                status: 'PAST_DUE',
            },
            include: {
                customer: true,
                price: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: { currentPeriodEnd: 'asc' },
        });
        const stats = {
            totalPastDue: pastDueSubscriptions.length,
            totalRevenue: pastDueSubscriptions.reduce((sum, sub) => {
                return sum + (sub.price.amount || 0);
            }, 0),
        };
        return {
            stats,
            subscriptions: pastDueSubscriptions,
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map