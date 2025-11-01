import { SubscriptionsService } from './subscriptions.service';
export declare class SubscriptionsController {
    private subscriptionsService;
    constructor(subscriptionsService: SubscriptionsService);
    listSubscriptions(user: any, customerId?: string): Promise<({
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
    })[]>;
    getSubscription(id: string, user: any): Promise<{
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
    }>;
    cancelSubscription(id: string, user: any): Promise<{
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
    }>;
}
