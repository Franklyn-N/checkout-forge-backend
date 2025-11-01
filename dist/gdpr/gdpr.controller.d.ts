import { GdprService } from './gdpr.service';
export declare class GdprController {
    private gdprService;
    constructor(gdprService: GdprService);
    exportCustomerData(user: any, customerId: string): Promise<{
        exportDate: string;
        customer: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
            billingAddress: import("@prisma/client/runtime/library").JsonValue;
            shippingAddress: import("@prisma/client/runtime/library").JsonValue;
            createdAt: Date;
            gdprConsent: boolean;
            gdprConsentDate: Date;
        };
        orders: ({
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
        })[];
        subscriptions: ({
            price: {
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
            } & {
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
            tenantId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            priceId: string;
            status: import(".prisma/client").$Enums.SubscriptionStatus;
            customerId: string;
            stripeSubscriptionId: string | null;
            currentPeriodStart: Date;
            currentPeriodEnd: Date;
            cancelAtPeriodEnd: boolean;
            canceledAt: Date | null;
            trialStart: Date | null;
            trialEnd: Date | null;
        })[];
    }>;
    deleteCustomerData(user: any, customerId: string): Promise<{
        success: boolean;
        message: string;
        customerId: string;
    }>;
}
