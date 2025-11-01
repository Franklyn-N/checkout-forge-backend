import { PrismaService } from '../prisma/prisma.service';
import { GenerateInvoiceDto } from './dto';
export declare class InvoicesService {
    private prisma;
    constructor(prisma: PrismaService);
    generateInvoice(tenantId: string, dto: GenerateInvoiceDto): Promise<{
        tenantId: string;
        id: string;
        createdAt: Date;
        orderId: string;
        dueAt: Date | null;
        invoiceNumber: string;
        pdfUrl: string | null;
        issuedAt: Date;
    }>;
    private generateInvoiceNumber;
    getInvoice(tenantId: string, invoiceId: string): Promise<{
        tenant: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            currency: string;
            slug: string;
            settings: import("@prisma/client/runtime/library").JsonValue | null;
            domain: string | null;
            stripeAccountId: string | null;
            stripeConnectEnabled: boolean;
            vatNumber: string | null;
            country: string;
        };
        order: {
            customer: {
                email: string;
                firstName: string | null;
                lastName: string | null;
                tenantId: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                metadata: import("@prisma/client/runtime/library").JsonValue | null;
                phone: string | null;
                stripeCustomerId: string | null;
                billingAddress: import("@prisma/client/runtime/library").JsonValue | null;
                shippingAddress: import("@prisma/client/runtime/library").JsonValue | null;
                gdprConsent: boolean;
                gdprConsentDate: Date | null;
            };
            items: ({
                product: {
                    name: string;
                    description: string | null;
                    tenantId: string;
                    id: string;
                    isActive: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    imageUrl: string | null;
                    metadata: import("@prisma/client/runtime/library").JsonValue | null;
                };
                price: {
                    type: import(".prisma/client").$Enums.PriceType;
                    id: string;
                    isActive: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    metadata: import("@prisma/client/runtime/library").JsonValue | null;
                    amount: number;
                    currency: string;
                    interval: import(".prisma/client").$Enums.BillingInterval | null;
                    intervalCount: number | null;
                    trialDays: number | null;
                    stripePriceId: string | null;
                    productId: string;
                };
            } & {
                id: string;
                createdAt: Date;
                productId: string;
                priceId: string;
                quantity: number;
                total: number;
                unitPrice: number;
                isOrderBump: boolean;
                orderId: string;
            })[];
        } & {
            tenantId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            currency: string;
            couponCode: string | null;
            checkoutPageId: string | null;
            orderNumber: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            subtotal: number;
            vatAmount: number;
            discount: number;
            total: number;
            stripePaymentIntentId: string | null;
            stripeChargeId: string | null;
            customerId: string;
            affiliateId: string | null;
        };
    } & {
        tenantId: string;
        id: string;
        createdAt: Date;
        orderId: string;
        dueAt: Date | null;
        invoiceNumber: string;
        pdfUrl: string | null;
        issuedAt: Date;
    }>;
    listInvoices(tenantId: string, page?: number, limit?: number): Promise<{
        data: ({
            order: {
                customer: {
                    email: string;
                    firstName: string | null;
                    lastName: string | null;
                    tenantId: string;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    metadata: import("@prisma/client/runtime/library").JsonValue | null;
                    phone: string | null;
                    stripeCustomerId: string | null;
                    billingAddress: import("@prisma/client/runtime/library").JsonValue | null;
                    shippingAddress: import("@prisma/client/runtime/library").JsonValue | null;
                    gdprConsent: boolean;
                    gdprConsentDate: Date | null;
                };
            } & {
                tenantId: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                metadata: import("@prisma/client/runtime/library").JsonValue | null;
                currency: string;
                couponCode: string | null;
                checkoutPageId: string | null;
                orderNumber: string;
                status: import(".prisma/client").$Enums.OrderStatus;
                subtotal: number;
                vatAmount: number;
                discount: number;
                total: number;
                stripePaymentIntentId: string | null;
                stripeChargeId: string | null;
                customerId: string;
                affiliateId: string | null;
            };
        } & {
            tenantId: string;
            id: string;
            createdAt: Date;
            orderId: string;
            dueAt: Date | null;
            invoiceNumber: string;
            pdfUrl: string | null;
            issuedAt: Date;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    generatePDF(tenantId: string, invoiceId: string): Promise<string>;
    private generateInvoiceHTML;
}
