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
exports.InvoicesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let InvoicesService = class InvoicesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateInvoice(tenantId, dto) {
        const order = await this.prisma.order.findFirst({
            where: { id: dto.orderId, tenantId },
            include: {
                customer: true,
                items: {
                    include: {
                        product: true,
                        price: true,
                    },
                },
                tenant: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        const existingInvoice = await this.prisma.invoice.findUnique({
            where: { orderId: dto.orderId },
        });
        if (existingInvoice) {
            return existingInvoice;
        }
        const invoiceNumber = await this.generateInvoiceNumber(tenantId);
        const invoice = await this.prisma.invoice.create({
            data: {
                tenantId,
                orderId: dto.orderId,
                invoiceNumber,
                issuedAt: new Date(),
                dueAt: dto.dueAt ? new Date(dto.dueAt) : null,
            },
        });
        return invoice;
    }
    async generateInvoiceNumber(tenantId) {
        const count = await this.prisma.invoice.count({
            where: { tenantId },
        });
        const year = new Date().getFullYear();
        const paddedCount = String(count + 1).padStart(5, '0');
        return `INV-${year}-${paddedCount}`;
    }
    async getInvoice(tenantId, invoiceId) {
        const invoice = await this.prisma.invoice.findFirst({
            where: { id: invoiceId, tenantId },
            include: {
                order: {
                    include: {
                        customer: true,
                        items: {
                            include: {
                                product: true,
                                price: true,
                            },
                        },
                    },
                },
                tenant: true,
            },
        });
        if (!invoice) {
            throw new common_1.NotFoundException('Invoice not found');
        }
        return invoice;
    }
    async listInvoices(tenantId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [invoices, total] = await Promise.all([
            this.prisma.invoice.findMany({
                where: { tenantId },
                include: {
                    order: {
                        include: {
                            customer: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.invoice.count({
                where: { tenantId },
            }),
        ]);
        return {
            data: invoices,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async generatePDF(tenantId, invoiceId) {
        const invoice = await this.getInvoice(tenantId, invoiceId);
        const html = this.generateInvoiceHTML(invoice);
        return html;
    }
    generateInvoiceHTML(invoice) {
        const { order, tenant } = invoice;
        return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice ${invoice.invoiceNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
    .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .company-info h1 { margin: 0; font-size: 24px; }
    .invoice-info { text-align: right; }
    .invoice-number { font-size: 20px; font-weight: bold; margin-bottom: 10px; }
    .section { margin-bottom: 30px; }
    .section h2 { font-size: 16px; margin-bottom: 10px; border-bottom: 2px solid #333; padding-bottom: 5px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #f5f5f5; font-weight: bold; }
    .text-right { text-align: right; }
    .totals { margin-top: 20px; }
    .totals tr td { border: none; padding: 5px 10px; }
    .totals .grand-total { font-weight: bold; font-size: 18px; border-top: 2px solid #333; }
  </style>
</head>
<body>
  <div class="header">
    <div class="company-info">
      <h1>${tenant.name}</h1>
      <p>${tenant.country || 'GB'}</p>
      ${tenant.vatNumber ? `<p>VAT Number: ${tenant.vatNumber}</p>` : ''}
    </div>
    <div class="invoice-info">
      <div class="invoice-number">INVOICE ${invoice.invoiceNumber}</div>
      <p><strong>Date:</strong> ${invoice.issuedAt.toLocaleDateString()}</p>
      ${invoice.dueAt ? `<p><strong>Due Date:</strong> ${invoice.dueAt.toLocaleDateString()}</p>` : ''}
    </div>
  </div>

  <div class="section">
    <h2>Bill To</h2>
    <p>
      ${order.customer.firstName || ''} ${order.customer.lastName || ''}<br>
      ${order.customer.email}
    </p>
  </div>

  <div class="section">
    <h2>Items</h2>
    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th class="text-right">Quantity</th>
          <th class="text-right">Unit Price</th>
          <th class="text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        ${order.items.map((item) => `
          <tr>
            <td>${item.product.name}</td>
            <td class="text-right">${item.quantity}</td>
            <td class="text-right">${(item.unitPrice / 100).toFixed(2)} ${order.currency}</td>
            <td class="text-right">${(item.total / 100).toFixed(2)} ${order.currency}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <table class="totals">
      <tr>
        <td></td>
        <td class="text-right"><strong>Subtotal:</strong></td>
        <td class="text-right">${(order.subtotal / 100).toFixed(2)} ${order.currency}</td>
      </tr>
      ${order.vatAmount > 0 ? `
      <tr>
        <td></td>
        <td class="text-right"><strong>VAT:</strong></td>
        <td class="text-right">${(order.vatAmount / 100).toFixed(2)} ${order.currency}</td>
      </tr>
      ` : ''}
      ${order.discount > 0 ? `
      <tr>
        <td></td>
        <td class="text-right"><strong>Discount:</strong></td>
        <td class="text-right">-${(order.discount / 100).toFixed(2)} ${order.currency}</td>
      </tr>
      ` : ''}
      <tr class="grand-total">
        <td></td>
        <td class="text-right"><strong>Total:</strong></td>
        <td class="text-right">${(order.total / 100).toFixed(2)} ${order.currency}</td>
      </tr>
    </table>
  </div>

  <div class="section">
    <p><small>Order Number: ${order.orderNumber}</small></p>
  </div>
</body>
</html>
    `.trim();
    }
};
exports.InvoicesService = InvoicesService;
exports.InvoicesService = InvoicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InvoicesService);
//# sourceMappingURL=invoices.service.js.map