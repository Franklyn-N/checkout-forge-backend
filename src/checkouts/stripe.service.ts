import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private config: ConfigService) {
    this.stripe = new Stripe(
      this.config.get('STRIPE_SECRET_KEY') || 'sk_test_dummy',
      {
        apiVersion: '2023-10-16',
      },
    );
  }

  getStripe(): Stripe {
    return this.stripe;
  }

  async createPaymentIntent(params: {
    amount: number;
    currency: string;
    customerId?: string;
    metadata?: Record<string, string>;
    savePaymentMethod?: boolean;
  }): Promise<Stripe.PaymentIntent> {
    const createParams: Stripe.PaymentIntentCreateParams = {
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

  async createSetupIntent(customerId: string): Promise<Stripe.SetupIntent> {
    return this.stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
    });
  }

  async createCheckoutSession(params: {
    priceIds: string[];
    successUrl: string;
    cancelUrl: string;
    customerId?: string;
    metadata?: Record<string, string>;
  }): Promise<Stripe.Checkout.Session> {
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

  async createCustomer(email: string, name?: string): Promise<Stripe.Customer> {
    return this.stripe.customers.create({
      email,
      name,
    });
  }

  async createRefund(paymentIntentId: string, amount?: number): Promise<Stripe.Refund> {
    return this.stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount,
    });
  }

  async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return this.stripe.subscriptions.cancel(subscriptionId);
  }

  verifyWebhookSignature(
    payload: string | Buffer,
    signature: string,
  ): Stripe.Event {
    const webhookSecret = this.config.get('STRIPE_WEBHOOK_SECRET');
    return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  }
}
