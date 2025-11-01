import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from '../checkouts/stripe.service';

@Injectable()
export class SubscriptionsService {
  constructor(
    private prisma: PrismaService,
    private stripeService: StripeService,
  ) {}

  async listSubscriptions(tenantId: string, customerId?: string) {
    return this.prisma.subscription.findMany({
      where: {
        tenantId,
        ...(customerId && { customerId }),
      },
      include: {
        customer: true,
        price: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSubscription(id: string, tenantId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { id, tenantId },
      include: {
        customer: true,
        price: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    return subscription;
  }

  async cancelSubscription(id: string, tenantId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { id, tenantId },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (subscription.stripeSubscriptionId) {
      await this.stripeService.cancelSubscription(subscription.stripeSubscriptionId);
    }

    return this.prisma.subscription.update({
      where: { id },
      data: {
        status: 'CANCELED',
        canceledAt: new Date(),
        cancelAtPeriodEnd: true,
      },
    });
  }
}
