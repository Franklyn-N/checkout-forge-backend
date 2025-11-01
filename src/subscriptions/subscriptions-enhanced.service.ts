import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from '../checkouts/stripe.service';

@Injectable()
export class SubscriptionsEnhancedService {
  constructor(
    private prisma: PrismaService,
    private stripeService: StripeService,
  ) {}

  async createSubscription(params: {
    customerId: string;
    priceId: string;
    tenantId: string;
    trialDays?: number;
    paymentMethodId?: string;
  }) {
    const customer = await this.prisma.customer.findFirst({
      where: { id: params.customerId, tenantId: params.tenantId },
    });

    if (!customer || !customer.stripeCustomerId) {
      throw new NotFoundException('Customer not found');
    }

    const price = await this.prisma.price.findUnique({
      where: { id: params.priceId },
      include: { product: true },
    });

    if (!price || price.type !== 'RECURRING') {
      throw new BadRequestException('Invalid recurring price');
    }

    const subscriptionParams: any = {
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

    const stripeSubscription = await this.stripeService.getStripe().subscriptions.create(
      subscriptionParams
    );

    const now = new Date();
    const periodEnd = new Date(stripeSubscription.current_period_end * 1000);

    const subscription = await this.prisma.subscription.create({
      data: {
        tenantId: params.tenantId,
        customerId: params.customerId,
        priceId: params.priceId,
        stripeSubscriptionId: stripeSubscription.id,
        status: stripeSubscription.status.toUpperCase() as any,
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        trialStart: stripeSubscription.trial_start ? new Date(stripeSubscription.trial_start * 1000) : null,
        trialEnd: stripeSubscription.trial_end ? new Date(stripeSubscription.trial_end * 1000) : null,
      },
    });

    return {
      subscription,
      clientSecret: (stripeSubscription.latest_invoice as any)?.payment_intent?.client_secret,
    };
  }

  async changePlan(
    subscriptionId: string,
    newPriceId: string,
    tenantId: string,
    prorate: boolean = true,
  ) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { id: subscriptionId, tenantId },
    });

    if (!subscription || !subscription.stripeSubscriptionId) {
      throw new NotFoundException('Subscription not found');
    }

    const newPrice = await this.prisma.price.findUnique({
      where: { id: newPriceId },
    });

    if (!newPrice || !newPrice.stripePriceId) {
      throw new BadRequestException('Invalid price');
    }

    const stripeSubscription = await this.stripeService.getStripe().subscriptions.retrieve(
      subscription.stripeSubscriptionId
    );

    const updatedSubscription = await this.stripeService.getStripe().subscriptions.update(
      subscription.stripeSubscriptionId,
      {
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
      }
    );

    await this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        priceId: newPriceId,
        status: updatedSubscription.status.toUpperCase() as any,
        currentPeriodEnd: new Date(updatedSubscription.current_period_end * 1000),
        metadata: {
          ...(subscription.metadata as any || {}),
          planChangeHistory: [
            ...((subscription.metadata as any)?.planChangeHistory || []),
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

  async retryFailedPayment(subscriptionId: string, tenantId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { id: subscriptionId, tenantId },
    });

    if (!subscription || !subscription.stripeSubscriptionId) {
      throw new NotFoundException('Subscription not found');
    }

    const stripeSubscription = await this.stripeService.getStripe().subscriptions.retrieve(
      subscription.stripeSubscriptionId,
      { expand: ['latest_invoice'] }
    );

    if (!stripeSubscription.latest_invoice) {
      throw new BadRequestException('No invoice to retry');
    }

    const invoice = await this.stripeService.getStripe().invoices.retrieve(
      stripeSubscription.latest_invoice as string
    );

    if (invoice.status === 'paid') {
      throw new BadRequestException('Invoice already paid');
    }

    const retryResult = await this.stripeService.getStripe().invoices.pay(invoice.id, {
      forgive: false,
    });

    await this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: retryResult.status === 'paid' ? 'ACTIVE' : 'PAST_DUE',
        metadata: {
          ...(subscription.metadata as any || {}),
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

  async createManualInvoice(params: {
    customerId: string;
    tenantId: string;
    items: Array<{ description: string; amount: number }>;
    dueDate?: Date;
  }) {
    const customer = await this.prisma.customer.findFirst({
      where: { id: params.customerId, tenantId: params.tenantId },
    });

    if (!customer || !customer.stripeCustomerId) {
      throw new NotFoundException('Customer not found');
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

    const invoiceParams: any = {
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

  async getDunningStatus(subscriptionId: string, tenantId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { id: subscriptionId, tenantId },
    });

    if (!subscription || !subscription.stripeSubscriptionId) {
      throw new NotFoundException('Subscription not found');
    }

    const stripeSubscription = await this.stripeService.getStripe().subscriptions.retrieve(
      subscription.stripeSubscriptionId,
      { expand: ['latest_invoice'] }
    );

    const invoice = stripeSubscription.latest_invoice as any;

    return {
      subscriptionStatus: stripeSubscription.status,
      invoiceStatus: invoice?.status,
      attemptCount: invoice?.attempt_count || 0,
      nextPaymentAttempt: invoice?.next_payment_attempt ? new Date(invoice.next_payment_attempt * 1000) : null,
      amountDue: invoice?.amount_due || 0,
    };
  }
}
