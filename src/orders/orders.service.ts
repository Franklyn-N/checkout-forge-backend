import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from '../checkouts/stripe.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private stripeService: StripeService,
  ) {}

  async getOrder(id: string, tenantId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, tenantId },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
            price: true,
          },
        },
        refunds: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async listOrders(tenantId: string, customerId?: string) {
    return this.prisma.order.findMany({
      where: {
        tenantId,
        ...(customerId && { customerId }),
      },
      include: {
        customer: true,
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async refundOrder(id: string, tenantId: string, amount?: number, reason?: string, processedBy?: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, tenantId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== 'PAID') {
      throw new Error('Only paid orders can be refunded');
    }

    const refundAmount = amount || order.total;
    const existingRefunds = await this.prisma.refund.findMany({
      where: { orderId: order.id },
    });
    const totalRefunded = existingRefunds.reduce((sum, r) => sum + r.amount, 0);

    if (totalRefunded + refundAmount > order.total) {
      throw new Error('Refund amount exceeds order total');
    }

    const stripeRefund = await this.stripeService.createRefund(
      order.stripePaymentIntentId,
      refundAmount,
    );

    const refund = await this.prisma.refund.create({
      data: {
        orderId: order.id,
        amount: refundAmount,
        reason,
        stripeRefundId: stripeRefund.id,
        processedBy,
      },
    });

    const isFullRefund = totalRefunded + refundAmount === order.total;
    await this.prisma.order.update({
      where: { id: order.id },
      data: {
        status: isFullRefund ? 'REFUNDED' : 'PARTIALLY_REFUNDED',
      },
    });

    return refund;
  }
}
