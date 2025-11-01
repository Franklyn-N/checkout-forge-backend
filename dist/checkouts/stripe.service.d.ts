import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
export declare class StripeService {
    private config;
    private stripe;
    constructor(config: ConfigService);
    getStripe(): Stripe;
    createPaymentIntent(params: {
        amount: number;
        currency: string;
        customerId?: string;
        metadata?: Record<string, string>;
        savePaymentMethod?: boolean;
    }): Promise<Stripe.PaymentIntent>;
    createSetupIntent(customerId: string): Promise<Stripe.SetupIntent>;
    createCheckoutSession(params: {
        priceIds: string[];
        successUrl: string;
        cancelUrl: string;
        customerId?: string;
        metadata?: Record<string, string>;
    }): Promise<Stripe.Checkout.Session>;
    createCustomer(email: string, name?: string): Promise<Stripe.Customer>;
    createRefund(paymentIntentId: string, amount?: number): Promise<Stripe.Refund>;
    cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription>;
    verifyWebhookSignature(payload: string | Buffer, signature: string): Stripe.Event;
}
