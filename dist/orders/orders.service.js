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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const stripe_service_1 = require("../checkouts/stripe.service");
let OrdersService = class OrdersService {
    constructor(prisma, stripeService) {
        this.prisma = prisma;
        this.stripeService = stripeService;
    }
    async getOrder(id, tenantId) {
        const order = await this.prisma.order.findFirst({
            where: { id, tenantId },
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
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    async listOrders(tenantId, customerId) {
        return this.prisma.order.findMany({
            where: {
                tenantId,
                ...(customerId && { customerId }),
            },
            include: {
                customer: true,
                items: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async refundOrder(id, tenantId, amount, reason, processedBy) {
        const order = await this.prisma.order.findFirst({
            where: { id, tenantId },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (order.status !== 'PAID') {
            throw new Error('Only paid orders can be refunded');
        }
        const refundAmount = amount || order.total;
        const existingRefunds = await this.prisma.refund.findMany({
            where: { orderId: order.id },
        });
        const totalRefunded = existingRefunds.reduce((sum, r) => sum + r.amount, 0);
        if (totalRefunded + refundAmount > order.total) {
            throw new Error('Refund amount exceeds order total');
        }
        const stripeRefund = await this.stripeService.createRefund(order.stripePaymentIntentId, refundAmount);
        const refund = await this.prisma.refund.create({
            data: {
                orderId: order.id,
                amount: refundAmount,
                reason,
                stripeRefundId: stripeRefund.id,
                processedBy,
            },
        });
        const isFullRefund = totalRefunded + refundAmount === order.total;
        await this.prisma.order.update({
            where: { id: order.id },
            data: {
                status: isFullRefund ? 'REFUNDED' : 'PARTIALLY_REFUNDED',
            },
        });
        return refund;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        stripe_service_1.StripeService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map