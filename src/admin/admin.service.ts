import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, CreatePriceDto, UpdatePriceDto, ProcessRefundDto } from './dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async createProduct(tenantId: string, dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        ...dto,
        tenantId,
      },
      include: {
        prices: true,
      },
    });
  }

  async updateProduct(tenantId: string, productId: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.findFirst({
      where: { id: productId, tenantId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.product.update({
      where: { id: productId },
      data: dto,
      include: {
        prices: true,
      },
    });
  }

  async deleteProduct(tenantId: string, productId: string) {
    const product = await this.prisma.product.findFirst({
      where: { id: productId, tenantId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.prisma.product.delete({
      where: { id: productId },
    });

    return { message: 'Product deleted successfully' };
  }

  async getProduct(tenantId: string, productId: string) {
    const product = await this.prisma.product.findFirst({
      where: { id: productId, tenantId },
      include: {
        prices: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async listProducts(tenantId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where: { tenantId },
        include: {
          prices: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.product.count({
        where: { tenantId },
      }),
    ]);

    return {
      data: products,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createPrice(tenantId: string, dto: CreatePriceDto) {
    const product = await this.prisma.product.findFirst({
      where: { id: dto.productId, tenantId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.price.create({
      data: {
        productId: dto.productId,
        amount: dto.amount,
        currency: dto.currency || 'GBP',
        type: dto.type,
        interval: dto.interval,
        intervalCount: dto.intervalCount,
        trialDays: dto.trialDays,
        isActive: dto.isActive !== undefined ? dto.isActive : true,
      },
    });
  }

  async updatePrice(tenantId: string, priceId: string, dto: UpdatePriceDto) {
    const price = await this.prisma.price.findFirst({
      where: {
        id: priceId,
        product: { tenantId },
      },
    });

    if (!price) {
      throw new NotFoundException('Price not found');
    }

    return this.prisma.price.update({
      where: { id: priceId },
      data: dto,
    });
  }

  async deletePrice(tenantId: string, priceId: string) {
    const price = await this.prisma.price.findFirst({
      where: {
        id: priceId,
        product: { tenantId },
      },
    });

    if (!price) {
      throw new NotFoundException('Price not found');
    }

    await this.prisma.price.delete({
      where: { id: priceId },
    });

    return { message: 'Price deleted successfully' };
  }

  async listOrders(tenantId: string, page: number = 1, limit: number = 20, status?: string) {
    const skip = (page - 1) * limit;
    const where: any = { tenantId };

    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
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
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getOrder(tenantId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, tenantId },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
            price: true,
          },
        },
        refunds: true,
        checkoutPage: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async processRefund(tenantId: string, dto: ProcessRefundDto, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: dto.orderId, tenantId },
      include: {
        refunds: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const totalRefunded = order.refunds.reduce((sum, r) => sum + r.amount, 0);
    const remainingAmount = order.total - totalRefunded;

    if (dto.amount > remainingAmount) {
      throw new BadRequestException('Refund amount exceeds remaining order total');
    }

    const refund = await this.prisma.refund.create({
      data: {
        orderId: dto.orderId,
        amount: dto.amount,
        reason: dto.reason,
        processedBy: userId,
      },
    });

    const newTotalRefunded = totalRefunded + dto.amount;
    const newStatus = newTotalRefunded >= order.total ? 'REFUNDED' : 'PARTIALLY_REFUNDED';

    await this.prisma.order.update({
      where: { id: dto.orderId },
      data: { status: newStatus },
    });

    return refund;
  }

  async listSubscriptions(tenantId: string, page: number = 1, limit: number = 20, status?: string) {
    const skip = (page - 1) * limit;
    const where: any = { tenantId };

    if (status) {
      where.status = status;
    }

    const [subscriptions, total] = await Promise.all([
      this.prisma.subscription.findMany({
        where,
        include: {
          customer: true,
          price: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.subscription.count({ where }),
    ]);

    return {
      data: subscriptions,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async cancelSubscription(tenantId: string, subscriptionId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { id: subscriptionId, tenantId },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    return this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: 'CANCELED',
        canceledAt: new Date(),
        cancelAtPeriodEnd: true,
      },
    });
  }

  async getDunningDashboard(tenantId: string) {
    const pastDueSubscriptions = await this.prisma.subscription.findMany({
      where: {
        tenantId,
        status: 'PAST_DUE',
      },
      include: {
        customer: true,
        price: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { currentPeriodEnd: 'asc' },
    });

    const stats = {
      totalPastDue: pastDueSubscriptions.length,
      totalRevenue: pastDueSubscriptions.reduce((sum, sub) => {
        return sum + (sub.price.amount || 0);
      }, 0),
    };

    return {
      stats,
      subscriptions: pastDueSubscriptions,
    };
  }
}
