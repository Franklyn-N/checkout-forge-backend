import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getVatReport(tenantId: string, from: Date, to: Date) {
    const orders = await this.prisma.order.findMany({
      where: {
        tenantId,
        status: 'PAID',
        createdAt: {
          gte: from,
          lte: to,
        },
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalVat = orders.reduce((sum, order) => sum + order.vatAmount, 0);
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const totalNet = orders.reduce((sum, order) => sum + order.subtotal, 0);

    return {
      period: {
        from: from.toISOString(),
        to: to.toISOString(),
      },
      summary: {
        totalOrders: orders.length,
        totalNet,
        totalVat,
        totalGross: totalSales,
        currency: 'GBP',
      },
      orders: orders.map((order) => ({
        orderNumber: order.orderNumber,
        date: order.createdAt,
        customer: {
          email: order.customer.email,
          name: `${order.customer.firstName || ''} ${order.customer.lastName || ''}`.trim(),
        },
        net: order.subtotal,
        vat: order.vatAmount,
        gross: order.total,
      })),
    };
  }
}
