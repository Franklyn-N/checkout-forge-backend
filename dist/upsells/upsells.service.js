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
exports.UpsellsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const stripe_service_1 = require("../checkouts/stripe.service");
let UpsellsService = class UpsellsService {
    constructor(prisma, stripeService) {
        this.prisma = prisma;
        this.stripeService = stripeService;
    }
    async getUpsellOffer(orderId, tenantId) {
        const order = await this.prisma.order.findFirst({
            where: { id: orderId, tenantId, status: 'PAID' },
            include: {
                checkoutPage: {
                    include: {
                        upsellOffers: {
                            where: { isActive: true },
                            orderBy: { displayOrder: 'asc' },
                        },
                    },
                },
                customer: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found or not eligible for upsell');
        }
        if (!order.checkoutPage?.upsellOffers.length) {
            return null;
        }
        const upsellOffer = order.checkoutPage.upsellOffers[0];
        const price = await this.prisma.price.findUnique({
            where: { id: upsellOffer.priceId },
            include: { product: true },
        });
        return {
            upsellOffer,
            price,
            product: price.product,
            customer: order.customer,
            originalOrder: order,
        };
    }
    async processOneClickUpsell(orderId, upsellOfferId, tenantId) {
        const order = await this.prisma.order.findFirst({
            where: { id: orderId, tenantId, status: 'PAID' },
            include: { customer: true },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        const upsellOffer = await this.prisma.upsellOffer.findUnique({
            where: { id: upsellOfferId },
        });
        if (!upsellOffer) {
            throw new common_1.NotFoundException('Upsell offer not found');
        }
        const price = await this.prisma.price.findUnique({
            where: { id: upsellOffer.priceId },
            include: { product: true },
        });
        if (!price) {
            throw new common_1.BadRequestException('Invalid price');
        }
        if (!order.customer.stripeCustomerId) {
            throw new common_1.BadRequestException('Customer has no saved payment method');
        }
        const customer = await this.stripeService.getStripe().customers.retrieve(order.customer.stripeCustomerId);
        if (!customer || customer.deleted) {
            throw new common_1.BadRequestException('Customer not found in Stripe');
        }
        const paymentMethods = await this.stripeService.getStripe().paymentMethods.list({
            customer: order.customer.stripeCustomerId,
            type: 'card',
        });
        if (!paymentMethods.data.length) {
            throw new common_1.BadRequestException('No saved payment method found');
        }
        const paymentMethodId = paymentMethods.data[0].id;
        let subtotal = price.amount;
        let vatAmount = 0;
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: tenantId },
        });
        if (tenant?.settings?.['vatEnabled']) {
            const vatRate = tenant.settings['vatPercentage'] || 20;
            vatAmount = Math.round(subtotal * (vatRate / 100));
        }
        const total = subtotal + vatAmount;
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}-UPSELL`;
        const upsellOrder = await this.prisma.order.create({
            data: {
                tenantId,
                customerId: order.customerId,
                checkoutPageId: order.checkoutPageId,
                orderNumber,
                subtotal,
                vatAmount,
                discount: 0,
                total,
                currency: price.currency,
                status: 'PENDING',
                metadata: {
                    originalOrderId: orderId,
                    isUpsell: true,
                    upsellOfferId,
                },
            },
        });
        await this.prisma.orderItem.create({
            data: {
                orderId: upsellOrder.id,
                productId: price.productId,
                priceId: price.id,
                quantity: 1,
                unitPrice: price.amount,
                total: price.amount,
                isOrderBump: false,
            },
        });
        try {
            const paymentIntent = await this.stripeService.getStripe().paymentIntents.create({
                amount: total,
                currency: price.currency.toLowerCase(),
                customer: order.customer.stripeCustomerId,
                payment_method: paymentMethodId,
                off_session: true,
                confirm: true,
                metadata: {
                    orderId: upsellOrder.id,
                    originalOrderId: orderId,
                    tenantId,
                    isUpsell: 'true',
                },
            });
            await this.prisma.order.update({
                where: { id: upsellOrder.id },
                data: {
                    stripePaymentIntentId: paymentIntent.id,
                    status: paymentIntent.status === 'succeeded' ? 'PAID' : 'FAILED',
                },
            });
            return {
                success: paymentIntent.status === 'succeeded',
                orderId: upsellOrder.id,
                orderNumber: upsellOrder.orderNumber,
                paymentIntentStatus: paymentIntent.status,
            };
        }
        catch (error) {
            await this.prisma.order.update({
                where: { id: upsellOrder.id },
                data: { status: 'FAILED' },
            });
            throw new common_1.BadRequestException(`Payment failed: ${error.message}`);
        }
    }
    async declineUpsell(orderId, upsellOfferId, tenantId) {
        const order = await this.prisma.order.findFirst({
            where: { id: orderId, tenantId },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return {
            success: true,
            message: 'Upsell declined',
        };
    }
};
exports.UpsellsService = UpsellsService;
exports.UpsellsService = UpsellsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        stripe_service_1.StripeService])
], UpsellsService);
//# sourceMappingURL=upsells.service.js.map