import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(private prisma: PrismaService) {}

  async handleWebhookEvent(event: Stripe.Event) {
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
          payload: event as any,
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
    } catch (error) {
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

  private async processEvent(event: Stripe.Event) {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await this.handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'charge.refunded':
        await this.handleChargeRefunded(event.data.object as Stripe.Charge);
        break;

      default:
        this.logger.log(`Unhandled event type: ${event.type}`);
    }
  }

  private async handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    const order = await this.prisma.order.findUnique({
      where: { stripePaymentIntentId: paymentIntent.id },
    });

    if (order) {
      await this.prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'PAID',
          stripeChargeId: paymentIntent.latest_charge as string,
        },
      });
      this.logger.log(`Order ${order.orderNumber} marked as PAID`);
    }
  }

  private async handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
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

  private async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const existingSub = await this.prisma.subscription.findUnique({
      where: { stripeSubscriptionId: subscription.id },
    });

    if (existingSub) {
      await this.prisma.subscription.update({
        where: { id: existingSub.id },
        data: {
          status: subscription.status.toUpperCase() as any,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        },
      });
      this.logger.log(`Subscription ${subscription.id} updated`);
    }
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
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

  private async handleChargeRefunded(charge: Stripe.Charge) {
    this.logger.log(`Charge refunded: ${charge.id}`);
  }
}
