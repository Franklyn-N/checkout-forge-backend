import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from '../checkouts/stripe.service';

@Injectable()
export class UpsellsService {
  constructor(
    private prisma: PrismaService,
    private stripeService: StripeService,
  ) {}

  async getUpsellOffer(orderId: string, tenantId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, tenantId, status: 'PAID' },
      include: {
        checkoutPage: {
          include: {
            upsellOffers: {
              where: { isActive: true },
              orderBy: { displayOrder: 'asc' },
            },
          },
        },
        customer: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found or not eligible for upsell');
    }

    if (!order.checkoutPage?.upsellOffers.length) {
      return null;
    }

    const upsellOffer = order.checkoutPage.upsellOffers[0];

    const price = await this.prisma.price.findUnique({
      where: { id: upsellOffer.priceId },
      include: { product: true },
    });

    return {
      upsellOffer,
      price,
      product: price.product,
      customer: order.customer,
      originalOrder: order,
    };
  }

  async processOneClickUpsell(
    orderId: string,
    upsellOfferId: string,
    tenantId: string,
  ) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, tenantId, status: 'PAID' },
      include: { customer: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const upsellOffer = await this.prisma.upsellOffer.findUnique({
      where: { id: upsellOfferId },
    });

    if (!upsellOffer) {
      throw new NotFoundException('Upsell offer not found');
    }

    const price = await this.prisma.price.findUnique({
      where: { id: upsellOffer.priceId },
      include: { product: true },
    });

    if (!price) {
      throw new BadRequestException('Invalid price');
    }

    if (!order.customer.stripeCustomerId) {
      throw new BadRequestException('Customer has no saved payment method');
    }

    const customer = await this.stripeService.getStripe().customers.retrieve(
      order.customer.stripeCustomerId,
    );

    if (!customer || customer.deleted) {
      throw new BadRequestException('Customer not found in Stripe');
    }

    const paymentMethods = await this.stripeService.getStripe().paymentMethods.list({
      customer: order.customer.stripeCustomerId,
      type: 'card',
    });

    if (!paymentMethods.data.length) {
      throw new BadRequestException('No saved payment method found');
    }

    const paymentMethodId = paymentMethods.data[0].id;

    let subtotal = price.amount;
    let vatAmount = 0;

    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (tenant?.settings?.['vatEnabled']) {
      const vatRate = (tenant.settings['vatPercentage'] as number) || 20;
      vatAmount = Math.round(subtotal * (vatRate / 100));
    }

    const total = subtotal + vatAmount;

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}-UPSELL`;

    const upsellOrder = await this.prisma.order.create({
      data: {
        tenantId,
        customerId: order.customerId,
        checkoutPageId: order.checkoutPageId,
        orderNumber,
        subtotal,
        vatAmount,
        discount: 0,
        total,
        currency: price.currency,
        status: 'PENDING',
        metadata: {
          originalOrderId: orderId,
          isUpsell: true,
          upsellOfferId,
        },
      },
    });

    await this.prisma.orderItem.create({
      data: {
        orderId: upsellOrder.id,
        productId: price.productId,
        priceId: price.id,
        quantity: 1,
        unitPrice: price.amount,
        total: price.amount,
        isOrderBump: false,
      },
    });

    try {
      const paymentIntent = await this.stripeService.getStripe().paymentIntents.create({
        amount: total,
        currency: price.currency.toLowerCase(),
        customer: order.customer.stripeCustomerId,
        payment_method: paymentMethodId,
        off_session: true,
        confirm: true,
        metadata: {
          orderId: upsellOrder.id,
          originalOrderId: orderId,
          tenantId,
          isUpsell: 'true',
        },
      });

      await this.prisma.order.update({
        where: { id: upsellOrder.id },
        data: {
          stripePaymentIntentId: paymentIntent.id,
          status: paymentIntent.status === 'succeeded' ? 'PAID' : 'FAILED',
        },
      });

      return {
        success: paymentIntent.status === 'succeeded',
        orderId: upsellOrder.id,
        orderNumber: upsellOrder.orderNumber,
        paymentIntentStatus: paymentIntent.status,
      };
    } catch (error) {
      await this.prisma.order.update({
        where: { id: upsellOrder.id },
        data: { status: 'FAILED' },
      });

      throw new BadRequestException(`Payment failed: ${error.message}`);
    }
  }

  async declineUpsell(orderId: string, upsellOfferId: string, tenantId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, tenantId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return {
      success: true,
      message: 'Upsell declined',
    };
  }
}
