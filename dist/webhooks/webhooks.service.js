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
var WebhooksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhooksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let WebhooksService = WebhooksService_1 = class WebhooksService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(WebhooksService_1.name);
    }
    async handleWebhookEvent(event) {
        const existingEvent = await this.prisma.webhookEvent.findUnique({
            where: { stripeEventId: event.id },
        });
        if (existingEvent && existingEvent.processed) {
            this.logger.log(`Event ${event.id} already processed, skipping`);
            return { received: true, alreadyProcessed: true };
        }
        let webhookRecord = existingEvent;
        if (!webhookRecord) {
            webhookRecord = await this.prisma.webhookEvent.create({
                data: {
                    type: event.type,
                    stripeEventId: event.id,
                    payload: event,
                },
            });
        }
        try {
            await this.processEvent(event);
            await this.prisma.webhookEvent.update({
                where: { id: webhookRecord.id },
                data: {
                    processed: true,
                    processedAt: new Date(),
                },
            });
            this.logger.log(`Successfully processed event ${event.id} (${event.type})`);
            return { received: true, processed: true };
        }
        catch (error) {
            this.logger.error(`Error processing event ${event.id}:`, error);
            await this.prisma.webhookEvent.update({
                where: { id: webhookRecord.id },
                data: {
                    processingError: error.message,
                },
            });
            throw error;
        }
    }
    async processEvent(event) {
        switch (event.type) {
            case 'payment_intent.succeeded':
                await this.handlePaymentIntentSucceeded(event.data.object);
                break;
            case 'payment_intent.payment_failed':
                await this.handlePaymentIntentFailed(event.data.object);
                break;
            case 'customer.subscription.created':
            case 'customer.subscription.updated':
                await this.handleSubscriptionUpdated(event.data.object);
                break;
            case 'customer.subscription.deleted':
                await this.handleSubscriptionDeleted(event.data.object);
                break;
            case 'charge.refunded':
                await this.handleChargeRefunded(event.data.object);
                break;
            default:
                this.logger.log(`Unhandled event type: ${event.type}`);
        }
    }
    async handlePaymentIntentSucceeded(paymentIntent) {
        const order = await this.prisma.order.findUnique({
            where: { stripePaymentIntentId: paymentIntent.id },
        });
        if (order) {
            await this.prisma.order.update({
                where: { id: order.id },
                data: {
                    status: 'PAID',
                    stripeChargeId: paymentIntent.latest_charge,
                },
            });
            this.logger.log(`Order ${order.orderNumber} marked as PAID`);
        }
    }
    async handlePaymentIntentFailed(paymentIntent) {
        const order = await this.prisma.order.findUnique({
            where: { stripePaymentIntentId: paymentIntent.id },
        });
        if (order) {
            await this.prisma.order.update({
                where: { id: order.id },
                data: { status: 'FAILED' },
            });
            this.logger.log(`Order ${order.orderNumber} marked as FAILED`);
        }
    }
    async handleSubscriptionUpdated(subscription) {
        const existingSub = await this.prisma.subscription.findUnique({
            where: { stripeSubscriptionId: subscription.id },
        });
        if (existingSub) {
            await this.prisma.subscription.update({
                where: { id: existingSub.id },
                data: {
                    status: subscription.status.toUpperCase(),
                    currentPeriodStart: new Date(subscription.current_period_start * 1000),
                    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                    cancelAtPeriodEnd: subscription.cancel_at_period_end,
                },
            });
            this.logger.log(`Subscription ${subscription.id} updated`);
        }
    }
    async handleSubscriptionDeleted(subscription) {
        const existingSub = await this.prisma.subscription.findUnique({
            where: { stripeSubscriptionId: subscription.id },
        });
        if (existingSub) {
            await this.prisma.subscription.update({
                where: { id: existingSub.id },
                data: {
                    status: 'CANCELED',
                    canceledAt: new Date(),
                },
            });
            this.logger.log(`Subscription ${subscription.id} canceled`);
        }
    }
    async handleChargeRefunded(charge) {
        this.logger.log(`Charge refunded: ${charge.id}`);
    }
};
exports.WebhooksService = WebhooksService;
exports.WebhooksService = WebhooksService = WebhooksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WebhooksService);
//# sourceMappingURL=webhooks.service.js.map