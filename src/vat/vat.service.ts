import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface VATRates {
  [countryCode: string]: number;
}

const EU_VAT_RATES: VATRates = {
  GB: 20,    // UK
  IE: 23,    // Ireland
  DE: 19,    // Germany
  FR: 20,    // France
  ES: 21,    // Spain
  IT: 22,    // Italy
  NL: 21,    // Netherlands
  BE: 21,    // Belgium
  PT: 23,    // Portugal
  SE: 25,    // Sweden
  DK: 25,    // Denmark
  FI: 24,    // Finland
  AT: 20,    // Austria
  PL: 23,    // Poland
  RO: 19,    // Romania
  CZ: 21,    // Czech Republic
  GR: 24,    // Greece
  HU: 27,    // Hungary
  BG: 20,    // Bulgaria
  HR: 25,    // Croatia
  SK: 20,    // Slovakia
  SI: 22,    // Slovenia
  LT: 21,    // Lithuania
  LV: 21,    // Latvia
  EE: 20,    // Estonia
  CY: 19,    // Cyprus
  LU: 17,    // Luxembourg
  MT: 18,    // Malta
};

@Injectable()
export class VatService {
  constructor(private prisma: PrismaService) {}

  getVATRate(countryCode: string): number {
    return EU_VAT_RATES[countryCode.toUpperCase()] || 0;
  }

  calculateVAT(params: {
    amount: number;
    countryCode: string;
    vatId?: string;
    includeVAT?: boolean;
  }): {
    netAmount: number;
    vatAmount: number;
    grossAmount: number;
    vatRate: number;
    vatApplied: boolean;
  } {
    const { amount, countryCode, vatId, includeVAT = true } = params;

    const isEUB2B = this.isValidEUVATId(vatId) && countryCode.toUpperCase() !== 'GB';

    if (isEUB2B) {
      return {
        netAmount: amount,
        vatAmount: 0,
        grossAmount: amount,
        vatRate: 0,
        vatApplied: false,
      };
    }

    if (!includeVAT) {
      return {
        netAmount: amount,
        vatAmount: 0,
        grossAmount: amount,
        vatRate: 0,
        vatApplied: false,
      };
    }

    const vatRate = this.getVATRate(countryCode);

    if (vatRate === 0) {
      return {
        netAmount: amount,
        vatAmount: 0,
        grossAmount: amount,
        vatRate: 0,
        vatApplied: false,
      };
    }

    const vatAmount = Math.round(amount * (vatRate / 100));
    const grossAmount = amount + vatAmount;

    return {
      netAmount: amount,
      vatAmount,
      grossAmount,
      vatRate,
      vatApplied: true,
    };
  }

  isValidEUVATId(vatId?: string): boolean {
    if (!vatId) return false;

    const cleanVatId = vatId.replace(/\s/g, '').toUpperCase();

    const vatRegex = /^(AT|BE|BG|CY|CZ|DE|DK|EE|EL|ES|FI|FR|GB|HR|HU|IE|IT|LT|LU|LV|MT|NL|PL|PT|RO|SE|SI|SK)U?[0-9A-Z]{8,12}$/;

    return vatRegex.test(cleanVatId);
  }

  async exportVATReport(params: {
    tenantId: string;
    fromDate: Date;
    toDate: Date;
  }): Promise<string> {
    const orders = await this.prisma.order.findMany({
      where: {
        tenantId: params.tenantId,
        status: 'PAID',
        createdAt: {
          gte: params.fromDate,
          lte: params.toDate,
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
      orderBy: { createdAt: 'asc' },
    });

    const csvHeader = [
      'Order ID',
      'Order Number',
      'Date',
      'Customer Email',
      'Customer VAT ID',
      'Country',
      'Net Amount (pence)',
      'VAT Rate (%)',
      'VAT Amount (pence)',
      'Gross Amount (pence)',
      'Currency',
      'VAT Applied',
    ].join(',');

    const csvRows = orders.map(order => {
      const customerVatId = (order.customer.metadata as any)?.vatId || '';
      const country = (order.customer.metadata as any)?.country || 'GB';
      const netAmount = order.subtotal - order.discount;
      const vatAmount = order.vatAmount;
      const grossAmount = order.total;
      const vatRate = vatAmount > 0 ? ((vatAmount / netAmount) * 100).toFixed(2) : '0.00';
      const vatApplied = vatAmount > 0 ? 'Yes' : 'No';

      return [
        order.id,
        order.orderNumber,
        order.createdAt.toISOString().split('T')[0],
        order.customer.email,
        customerVatId,
        country,
        netAmount.toString(),
        vatRate,
        vatAmount.toString(),
        grossAmount.toString(),
        order.currency,
        vatApplied,
      ].join(',');
    });

    const csv = [csvHeader, ...csvRows].join('\n');

    return csv;
  }

  async getVATSummary(params: {
    tenantId: string;
    fromDate: Date;
    toDate: Date;
  }) {
    const orders = await this.prisma.order.findMany({
      where: {
        tenantId: params.tenantId,
        status: 'PAID',
        createdAt: {
          gte: params.fromDate,
          lte: params.toDate,
        },
      },
      include: {
        customer: true,
      },
    });

    const summary = {
      totalOrders: orders.length,
      totalNet: 0,
      totalVAT: 0,
      totalGross: 0,
      byCountry: {} as Record<string, {
        count: number;
        net: number;
        vat: number;
        gross: number;
      }>,
      b2bZeroRated: {
        count: 0,
        net: 0,
      },
    };

    for (const order of orders) {
      const netAmount = order.subtotal - order.discount;
      const vatAmount = order.vatAmount;
      const grossAmount = order.total;
      const country = (order.customer.metadata as any)?.country || 'GB';
      const vatId = (order.customer.metadata as any)?.vatId;

      summary.totalNet += netAmount;
      summary.totalVAT += vatAmount;
      summary.totalGross += grossAmount;

      if (!summary.byCountry[country]) {
        summary.byCountry[country] = { count: 0, net: 0, vat: 0, gross: 0 };
      }

      summary.byCountry[country].count++;
      summary.byCountry[country].net += netAmount;
      summary.byCountry[country].vat += vatAmount;
      summary.byCountry[country].gross += grossAmount;

      if (this.isValidEUVATId(vatId) && vatAmount === 0) {
        summary.b2bZeroRated.count++;
        summary.b2bZeroRated.net += netAmount;
      }
    }

    return summary;
  }

  async updateCustomerVATInfo(params: {
    customerId: string;
    tenantId: string;
    vatId: string;
    country: string;
  }) {
    const customer = await this.prisma.customer.findFirst({
      where: { id: params.customerId, tenantId: params.tenantId },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const isValid = this.isValidEUVATId(params.vatId);

    return this.prisma.customer.update({
      where: { id: params.customerId },
      data: {
        metadata: {
          ...(customer.metadata as any || {}),
          vatId: params.vatId,
          vatIdValid: isValid,
          country: params.country,
          vatIdVerifiedAt: new Date().toISOString(),
        },
      },
    });
  }
}
