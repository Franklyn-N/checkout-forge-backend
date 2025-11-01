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
exports.CheckoutsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const stripe_service_1 = require("./stripe.service");
let CheckoutsService = class CheckoutsService {
    constructor(prisma, stripeService) {
        this.prisma = prisma;
        this.stripeService = stripeService;
    }
    async getCheckoutPage(slug, tenantId) {
        const checkoutPage = await this.prisma.checkoutPage.findFirst({
            where: {
                slug,
                tenantId,
                isActive: true,
            },
            include: {
                orderBumps: true,
                upsellOffers: true,
            },
        });
        if (!checkoutPage) {
            throw new common_1.NotFoundException('Checkout page not found');
        }
        return checkoutPage;
    }
    async createCheckoutSession(checkoutId, dto, tenantId) {
        const checkoutPage = await this.prisma.checkoutPage.findFirst({
            where: { id: checkoutId, tenantId },
            include: {
                tenant: true,
                orderBumps: true,
            },
        });
        if (!checkoutPage) {
            throw new common_1.NotFoundException('Checkout page not found');
        }
        const price = await this.prisma.price.findUnique({
            where: { id: dto.priceId },
            include: { product: true },
        });
        if (!price) {
            throw new common_1.BadRequestException('Invalid price');
        }
        let customer = await this.prisma.customer.findFirst({
            where: {
                email: dto.customerEmail,
                tenantId,
            },
        });
        if (!customer) {
            const stripeCustomer = await this.stripeService.createCustomer(dto.customerEmail, dto.customerName);
            customer = await this.prisma.customer.create({
                data: {
                    email: dto.customerEmail,
                    firstName: dto.customerName?.split(' ')[0],
                    lastName: dto.customerName?.split(' ').slice(1).join(' '),
                    tenantId,
                    stripeCustomerId: stripeCustomer.id,
                },
            });
        }
        let subtotal = price.amount * (dto.quantity || 1);
        const orderBumpItems = [];
        if (dto.orderBumpIds && dto.orderBumpIds.length > 0) {
            for (const bumpId of dto.orderBumpIds) {
                const bump = await this.prisma.orderBump.findUnique({
                    where: { id: bumpId },
                });
                if (bump) {
                    const bumpPrice = await this.prisma.price.findUnique({
                        where: { id: bump.priceId },
                    });
                    if (bumpPrice) {
                        subtotal += bumpPrice.amount;
                        orderBumpItems.push({ bump, price: bumpPrice });
                    }
                }
            }
        }
        let vatAmount = 0;
        if (checkoutPage.collectVat && dto.applyVat !== false) {
            const vatRate = Number(checkoutPage.vatPercentage) / 100;
            vatAmount = Math.round(subtotal * vatRate);
        }
        let discount = 0;
        if (dto.couponCode) {
            discount = Math.round(subtotal * 0.1);
        }
        const total = subtotal + vatAmount - discount;
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
        const order = await this.prisma.order.create({
            data: {
                tenantId,
                customerId: customer.id,
                checkoutPageId: checkoutPage.id,
                orderNumber,
                subtotal,
                vatAmount,
                discount,
                total,
                currency: price.currency,
                couponCode: dto.couponCode,
                status: 'PENDING',
            },
        });
        await this.prisma.orderItem.create({
            data: {
                orderId: order.id,
                productId: price.productId,
                priceId: price.id,
                quantity: dto.quantity || 1,
                unitPrice: price.amount,
                total: price.amount * (dto.quantity || 1),
                isOrderBump: false,
            },
        });
        for (const item of orderBumpItems) {
            const bumpProduct = await this.prisma.product.findFirst({
                where: { id: item.bump.productId },
            });
            if (bumpProduct) {
                await this.prisma.orderItem.create({
                    data: {
                        orderId: order.id,
                        productId: bumpProduct.id,
                        priceId: item.price.id,
                        quantity: 1,
                        unitPrice: item.price.amount,
                        total: item.price.amount,
                        isOrderBump: true,
                    },
                });
            }
        }
        const paymentIntent = await this.stripeService.createPaymentIntent({
            amount: total,
            currency: price.currency.toLowerCase(),
            customerId: customer.stripeCustomerId,
            metadata: {
                orderId: order.id,
                tenantId,
                checkoutPageId: checkoutPage.id,
            },
        });
        await this.prisma.order.update({
            where: { id: order.id },
            data: { stripePaymentIntentId: paymentIntent.id },
        });
        return {
            clientSecret: paymentIntent.client_secret,
            orderId: order.id,
            orderNumber: order.orderNumber,
            total,
            currency: price.currency,
        };
    }
};
exports.CheckoutsService = CheckoutsService;
exports.CheckoutsService = CheckoutsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        stripe_service_1.StripeService])
], CheckoutsService);
//# sourceMappingURL=checkouts.service.js.map