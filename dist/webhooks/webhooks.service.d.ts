import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';
export declare class WebhooksService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    handleWebhookEvent(event: Stripe.Event): Promise<{
        received: boolean;
        alreadyProcessed: boolean;
        processed?: undefined;
    } | {
        received: boolean;
        processed: boolean;
        alreadyProcessed?: undefined;
    }>;
    private processEvent;
    private handlePaymentIntentSucceeded;
    private handlePaymentIntentFailed;
    private handleSubscriptionUpdated;
    private handleSubscriptionDeleted;
    private handleChargeRefunded;
}
