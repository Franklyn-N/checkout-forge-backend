import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GdprService {
  constructor(private prisma: PrismaService) {}

  async logConsent(params: {
    tenantId: string;
    customerId: string;
    consentType: string;
    consentText: string;
    granted: boolean;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return this.prisma.customer.update({
      where: { id: params.customerId },
      data: {
        gdprConsent: params.granted,
        gdprConsentDate: new Date(),
      },
    });
  }

  async exportCustomerData(customerId: string, tenantId: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { id: customerId, tenantId },
      include: {
        orders: {
          include: {
            items: {
              include: {
                product: true,
                price: true,
              },
            },
            refunds: true,
          },
        },
        subscriptions: {
          include: {
            price: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return {
      exportDate: new Date().toISOString(),
      customer: {
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
        billingAddress: customer.billingAddress,
        shippingAddress: customer.shippingAddress,
        createdAt: customer.createdAt,
        gdprConsent: customer.gdprConsent,
        gdprConsentDate: customer.gdprConsentDate,
      },
      orders: customer.orders,
      subscriptions: customer.subscriptions,
    };
  }

  async deleteCustomerData(customerId: string, tenantId: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { id: customerId, tenantId },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    await this.prisma.customer.update({
      where: { id: customerId },
      data: {
        email: `deleted-${customerId}@anonymized.local`,
        firstName: 'DELETED',
        lastName: 'DELETED',
        phone: null,
        billingAddress: null,
        shippingAddress: null,
        metadata: { gdpr_deleted: true, deletedAt: new Date().toISOString() },
      },
    });

    return {
      success: true,
      message: 'Customer data anonymized',
      customerId,
    };
  }
}
