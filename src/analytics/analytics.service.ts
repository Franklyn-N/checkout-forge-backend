import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TrackEventDto } from './dto';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async trackEvent(tenantId: string, dto: TrackEventDto) {
    return this.prisma.analyticsEvent.create({
      data: {
        tenantId,
        eventType: dto.eventType,
        orderId: dto.orderId,
        sessionId: dto.sessionId,
        pageUrl: dto.pageUrl,
        metadata: dto.metadata,
      },
    });
  }

  async getDashboard(tenantId: string, startDate?: Date, endDate?: Date) {
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate || new Date();

    const [
      orders,
      pageViews,
      checkoutStarts,
      totalRevenue,
    ] = await Promise.all([
      this.prisma.order.findMany({
        where: {
          tenantId,
          status: 'PAID',
          createdAt: {
            gte: start,
            lte: end,
          },
        },
      }),
      this.prisma.analyticsEvent.count({
        where: {
          tenantId,
          eventType: 'page_view',
          createdAt: {
            gte: start,
            lte: end,
          },
        },
      }),
      this.prisma.analyticsEvent.count({
        where: {
          tenantId,
          eventType: 'checkout_start',
          createdAt: {
            gte: start,
            lte: end,
          },
        },
      }),
      this.prisma.order.aggregate({
        where: {
          tenantId,
          status: 'PAID',
          createdAt: {
            gte: start,
            lte: end,
          },
        },
        _sum: {
          total: true,
        },
      }),
    ]);

    const revenue = totalRevenue._sum.total || 0;
    const conversionCount = orders.length;
    const conversionRate = checkoutStarts > 0 ? (conversionCount / checkoutStarts) * 100 : 0;
    const aov = conversionCount > 0 ? revenue / conversionCount : 0;

    const revenueByDay = await this.getRevenueByDay(tenantId, start, end);
    const conversionsByDay = await this.getConversionsByDay(tenantId, start, end);

    return {
      summary: {
        revenue,
        orders: conversionCount,
        conversionRate: Math.round(conversionRate * 100) / 100,
        aov: Math.round(aov),
        pageViews,
        checkoutStarts,
      },
      charts: {
        revenueByDay,
        conversionsByDay,
      },
    };
  }

  private async getRevenueByDay(tenantId: string, startDate: Date, endDate: Date) {
    const orders = await this.prisma.order.findMany({
      where: {
        tenantId,
        status: 'PAID',
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        total: true,
        createdAt: true,
      },
    });

    const revenueMap = new Map<string, number>();

    orders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0];
      revenueMap.set(date, (revenueMap.get(date) || 0) + order.total);
    });

    return Array.from(revenueMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, revenue]) => ({ date, revenue }));
  }

  private async getConversionsByDay(tenantId: string, startDate: Date, endDate: Date) {
    const orders = await this.prisma.order.findMany({
      where: {
        tenantId,
        status: 'PAID',
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        createdAt: true,
      },
    });

    const conversionsMap = new Map<string, number>();

    orders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0];
      conversionsMap.set(date, (conversionsMap.get(date) || 0) + 1);
    });

    return Array.from(conversionsMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, conversions]) => ({ date, conversions }));
  }

  async getFunnel(tenantId: string, startDate?: Date, endDate?: Date) {
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate || new Date();

    const where = {
      tenantId,
      createdAt: {
        gte: start,
        lte: end,
      },
    };

    const [
      pageViews,
      addToCarts,
      checkoutStarts,
      payments,
    ] = await Promise.all([
      this.prisma.analyticsEvent.count({
        where: { ...where, eventType: 'page_view' },
      }),
      this.prisma.analyticsEvent.count({
        where: { ...where, eventType: 'add_to_cart' },
      }),
      this.prisma.analyticsEvent.count({
        where: { ...where, eventType: 'checkout_start' },
      }),
      this.prisma.order.count({
        where: {
          tenantId,
          status: 'PAID',
          createdAt: {
            gte: start,
            lte: end,
          },
        },
      }),
    ]);

    const calculateDropOff = (current: number, next: number) => {
      if (current === 0) return 0;
      return Math.round(((current - next) / current) * 100 * 100) / 100;
    };

    return [
      {
        step: 'Page Views',
        count: pageViews,
        dropOff: calculateDropOff(pageViews, addToCarts),
      },
      {
        step: 'Add to Cart',
        count: addToCarts,
        dropOff: calculateDropOff(addToCarts, checkoutStarts),
      },
      {
        step: 'Checkout Start',
        count: checkoutStarts,
        dropOff: calculateDropOff(checkoutStarts, payments),
      },
      {
        step: 'Payment Complete',
        count: payments,
        dropOff: 0,
      },
    ];
  }
}
