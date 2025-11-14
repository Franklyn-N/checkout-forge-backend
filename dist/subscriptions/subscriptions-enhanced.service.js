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
exports.SubscriptionsEnhancedService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const stripe_service_1 = require("../checkouts/stripe.service");
let SubscriptionsEnhancedService = class SubscriptionsEnhancedService {
    constructor(prisma, stripeService) {
        this.prisma = prisma;
        this.stripeService = stripeService;
    }
    async createSubscription(params) {
        const customer = await this.prisma.customer.findFirst({
            where: { id: params.customerId, tenantId: params.tenantId },
        });
        if (!customer || !customer.stripeCustomerId) {
            throw new common_1.NotFoundException('Customer not found');
        }
        const price = await this.prisma.price.findUnique({
            where: { id: params.priceId },
            include: { product: true },
        });
        if (!price || price.type !== 'RECURRING') {
            throw new common_1.BadRequestException('Invalid recurring price');
        }
        const subscriptionParams = {
            customer: customer.stripeCustomerId,
            items: [{ price: price.stripePriceId }],
            metadata: {
                customerId: params.customerId,
                tenantId: params.tenantId,
                priceId: params.priceId,
            },
            payment_behavior: 'default_incomplete',
            payment_settings: {
                save_default_payment_method: 'on_subscription',
            },
            expand: ['latest_invoice.payment_intent'],
        };
        if (params.trialDays && params.trialDays > 0) {
            subscriptionParams.trial_period_days = params.trialDays;
        }
        if (params.paymentMethodId) {
            subscriptionParams.default_payment_method = params.paymentMethodId;
        }
        const stripeSubscription = await this.stripeService.getStripe().subscriptions.create(subscriptionParams);
        const now = new Date();
        const periodEnd = new Date(stripeSubscription.current_period_end * 1000);
        const subscription = await this.prisma.subscription.create({
            data: {
                tenantId: params.tenantId,
                customerId: params.customerId,
                priceId: params.priceId,
                stripeSubscriptionId: stripeSubscription.id,
                status: stripeSubscription.status.toUpperCase(),
                currentPeriodStart: now,
                currentPeriodEnd: periodEnd,
                trialStart: stripeSubscription.trial_start ? new Date(stripeSubscription.trial_start * 1000) : null,
                trialEnd: stripeSubscription.trial_end ? new Date(stripeSubscription.trial_end * 1000) : null,
            },
        });
        return {
            subscription,
            clientSecret: stripeSubscription.latest_invoice?.payment_intent?.client_secret,
        };
    }
    async changePlan(subscriptionId, newPriceId, tenantId, prorate = true) {
        const subscription = await this.prisma.subscription.findFirst({
            where: { id: subscriptionId, tenantId },
        });
        if (!subscription || !subscription.stripeSubscriptionId) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        const newPrice = await this.prisma.price.findUnique({
            where: { id: newPriceId },
        });
        if (!newPrice || !newPrice.stripePriceId) {
            throw new common_1.BadRequestException('Invalid price');
        }
        const stripeSubscription = await this.stripeService.getStripe().subscriptions.retrieve(subscription.stripeSubscriptionId);
        const updatedSubscription = await this.stripeService.getStripe().subscriptions.update(subscription.stripeSubscriptionId, {
            items: [
                {
                    id: stripeSubscription.items.data[0].id,
                    price: newPrice.stripePriceId,
                },
            ],
            proration_behavior: prorate ? 'create_prorations' : 'none',
            metadata: {
                ...stripeSubscription.metadata,
                previousPriceId: subscription.priceId,
                newPriceId,
            },
        });
        await this.prisma.subscription.update({
            where: { id: subscriptionId },
            data: {
                priceId: newPriceId,
                status: updatedSubscription.status.toUpperCase(),
                currentPeriodEnd: new Date(updatedSubscription.current_period_end * 1000),
                metadata: {
                    ...(subscription.metadata || {}),
                    planChangeHistory: [
                        ...(subscription.metadata?.planChangeHistory || []),
                        {
                            from: subscription.priceId,
                            to: newPriceId,
                            changedAt: new Date().toISOString(),
                            prorated: prorate,
                        },
                    ],
                },
            },
        });
        return {
            success: true,
            subscription: updatedSubscription,
        };
    }
    async retryFailedPayment(subscriptionId, tenantId) {
        const subscription = await this.prisma.subscription.findFirst({
            where: { id: subscriptionId, tenantId },
        });
        if (!subscription || !subscription.stripeSubscriptionId) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        const stripeSubscription = await this.stripeService.getStripe().subscriptions.retrieve(subscription.stripeSubscriptionId, { expand: ['latest_invoice'] });
        if (!stripeSubscription.latest_invoice) {
            throw new common_1.BadRequestException('No invoice to retry');
        }
        const invoice = await this.stripeService.getStripe().invoices.retrieve(stripeSubscription.latest_invoice);
        if (invoice.status === 'paid') {
            throw new common_1.BadRequestException('Invoice already paid');
        }
        const retryResult = await this.stripeService.getStripe().invoices.pay(invoice.id, {
            forgive: false,
        });
        await this.prisma.subscription.update({
            where: { id: subscriptionId },
            data: {
                status: retryResult.status === 'paid' ? 'ACTIVE' : 'PAST_DUE',
                metadata: {
                    ...(subscription.metadata || {}),
                    lastRetryAttempt: new Date().toISOString(),
                    retrySuccessful: retryResult.status === 'paid',
                },
            },
        });
        return {
            success: retryResult.status === 'paid',
            invoiceStatus: retryResult.status,
        };
    }
    async createManualInvoice(params) {
        const customer = await this.prisma.customer.findFirst({
            where: { id: params.customerId, tenantId: params.tenantId },
        });
        if (!customer || !customer.stripeCustomerId) {
            throw new common_1.NotFoundException('Customer not found');
        }
        const invoiceItems = [];
        for (const item of params.items) {
            await this.stripeService.getStripe().invoiceItems.create({
                customer: customer.stripeCustomerId,
                amount: item.amount,
                currency: 'gbp',
                description: item.description,
            });
            invoiceItems.push(item);
        }
        const invoiceParams = {
            customer: customer.stripeCustomerId,
            auto_advance: true,
            collection_method: 'charge_automatically',
        };
        if (params.dueDate) {
            invoiceParams.due_date = Math.floor(params.dueDate.getTime() / 1000);
        }
        const invoice = await this.stripeService.getStripe().invoices.create(invoiceParams);
        await this.stripeService.getStripe().invoices.finalizeInvoice(invoice.id);
        return {
            success: true,
            invoice,
            invoiceUrl: invoice.hosted_invoice_url,
        };
    }
    async getDunningStatus(subscriptionId, tenantId) {
        const subscription = await this.prisma.subscription.findFirst({
            where: { id: subscriptionId, tenantId },
        });
        if (!subscription || !subscription.stripeSubscriptionId) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        const stripeSubscription = await this.stripeService.getStripe().subscriptions.retrieve(subscription.stripeSubscriptionId, { expand: ['latest_invoice'] });
        const invoice = stripeSubscription.latest_invoice;
        return {
            subscriptionStatus: stripeSubscription.status,
            invoiceStatus: invoice?.status,
            attemptCount: invoice?.attempt_count || 0,
            nextPaymentAttempt: invoice?.next_payment_attempt ? new Date(invoice.next_payment_attempt * 1000) : null,
            amountDue: invoice?.amount_due || 0,
        };
    }
};
exports.SubscriptionsEnhancedService = SubscriptionsEnhancedService;
exports.SubscriptionsEnhancedService = SubscriptionsEnhancedService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        stripe_service_1.StripeService])
], SubscriptionsEnhancedService);
//# sourceMappingURL=subscriptions-enhanced.service.js.map