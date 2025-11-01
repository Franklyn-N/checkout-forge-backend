import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from '../checkouts/stripe.service';
export declare class OrdersService {
    private prisma;
    private stripeService;
    constructor(prisma: PrismaService, stripeService: StripeService);
    getOrder(id: string, tenantId: string): Promise<{
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
        refunds: {
            id: string;
            createdAt: Date;
            amount: number;
            orderId: string;
            reason: string | null;
            stripeRefundId: string | null;
            processedBy: string | null;
        }[];
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
    }>;
    listOrders(tenantId: string, customerId?: string): Promise<({
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
        items: {
            id: string;
            createdAt: Date;
            productId: string;
            priceId: string;
            quantity: number;
            total: number;
            unitPrice: number;
            isOrderBump: boolean;
            orderId: string;
        }[];
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
    })[]>;
    refundOrder(id: string, tenantId: string, amount?: number, reason?: string, processedBy?: string): Promise<{
        id: string;
        createdAt: Date;
        amount: number;
        orderId: string;
        reason: string | null;
        stripeRefundId: string | null;
        processedBy: string | null;
    }>;
}
