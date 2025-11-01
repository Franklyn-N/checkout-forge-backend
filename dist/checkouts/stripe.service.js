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
exports.StripeService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const stripe_1 = require("stripe");
let StripeService = class StripeService {
    constructor(config) {
        this.config = config;
        this.stripe = new stripe_1.default(this.config.get('STRIPE_SECRET_KEY') || 'sk_test_dummy', {
            apiVersion: '2023-10-16',
        });
    }
    getStripe() {
        return this.stripe;
    }
    async createPaymentIntent(params) {
        const createParams = {
            amount: params.amount,
            currency: params.currency,
            customer: params.customerId,
            metadata: params.metadata,
            automatic_payment_methods: {
                enabled: true,
            },
        };
        if (params.savePaymentMethod && params.customerId) {
            createParams.setup_future_usage = 'off_session';
        }
        return this.stripe.paymentIntents.create(createParams);
    }
    async createSetupIntent(customerId) {
        return this.stripe.setupIntents.create({
            customer: customerId,
            payment_method_types: ['card'],
        });
    }
    async createCheckoutSession(params) {
        return this.stripe.checkout.sessions.create({
            mode: 'payment',
            line_items: params.priceIds.map((priceId) => ({
                price: priceId,
                quantity: 1,
            })),
            success_url: params.successUrl,
            cancel_url: params.cancelUrl,
            customer: params.customerId,
            metadata: params.metadata,
        });
    }
    async createCustomer(email, name) {
        return this.stripe.customers.create({
            email,
            name,
        });
    }
    async createRefund(paymentIntentId, amount) {
        return this.stripe.refunds.create({
            payment_intent: paymentIntentId,
            amount,
        });
    }
    async cancelSubscription(subscriptionId) {
        return this.stripe.subscriptions.cancel(subscriptionId);
    }
    verifyWebhookSignature(payload, signature) {
        const webhookSecret = this.config.get('STRIPE_WEBHOOK_SECRET');
        return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    }
};
exports.StripeService = StripeService;
exports.StripeService = StripeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StripeService);
//# sourceMappingURL=stripe.service.js.map