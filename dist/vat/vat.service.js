"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const EU_VAT_RATES = {
    GB: 20,
    IE: 23,
    DE: 19,
    FR: 20,
    ES: 21,
    IT: 22,
    NL: 21,
    BE: 21,
    PT: 23,
    SE: 25,
    DK: 25,
    FI: 24,
    AT: 20,
    PL: 23,
    RO: 19,
    CZ: 21,
    GR: 24,
    HU: 27,
    BG: 20,
    HR: 25,
    SK: 20,
    SI: 22,
    LT: 21,
    LV: 21,
    EE: 20,
    CY: 19,
    LU: 17,
    MT: 18,
};
let VatService = class VatService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    getVATRate(countryCode) {
        return EU_VAT_RATES[countryCode.toUpperCase()] || 0;
    }
    calculateVAT(params) {
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
    isValidEUVATId(vatId) {
        if (!vatId)
            return false;
        const cleanVatId = vatId.replace(/\s/g, '').toUpperCase();
        const vatRegex = /^(AT|BE|BG|CY|CZ|DE|DK|EE|EL|ES|FI|FR|GB|HR|HU|IE|IT|LT|LU|LV|MT|NL|PL|PT|RO|SE|SI|SK)U?[0-9A-Z]{8,12}$/;
        return vatRegex.test(cleanVatId);
    }
    async exportVATReport(params) {
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
            const customerVatId = order.customer.metadata?.vatId || '';
            const country = order.customer.metadata?.country || 'GB';
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
    async getVATSummary(params) {
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
            byCountry: {},
            b2bZeroRated: {
                count: 0,
                net: 0,
            },
        };
        for (const order of orders) {
            const netAmount = order.subtotal - order.discount;
            const vatAmount = order.vatAmount;
            const grossAmount = order.total;
            const country = order.customer.metadata?.country || 'GB';
            const vatId = order.customer.metadata?.vatId;
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
    async updateCustomerVATInfo(params) {
        const customer = await this.prisma.customer.findFirst({
            where: { id: params.customerId, tenantId: params.tenantId },
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        const isValid = this.isValidEUVATId(params.vatId);
        return this.prisma.customer.update({
            where: { id: params.customerId },
            data: {
                metadata: {
                    ...(customer.metadata || {}),
                    vatId: params.vatId,
                    vatIdValid: isValid,
                    country: params.country,
                    vatIdVerifiedAt: new Date().toISOString(),
                },
            },
        });
    }
};
exports.VatService = VatService;
exports.VatService = VatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VatService);
//# sourceMappingURL=vat.service.js.map