import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from '../checkouts/stripe.service';
export declare class UpsellsService {
    private prisma;
    private stripeService;
    constructor(prisma: PrismaService, stripeService: StripeService);
    getUpsellOffer(orderId: string, tenantId: string): Promise<{
        upsellOffer: {
            description: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            priceId: string;
            checkoutPageId: string;
            displayOrder: number;
            headline: string;
        };
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
        originalOrder: {
            checkoutPage: {
                upsellOffers: {
                    description: string | null;
                    id: string;
                    isActive: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    productId: string;
                    priceId: string;
                    checkoutPageId: string;
                    displayOrder: number;
                    headline: string;
                }[];
            } & {
                name: string;
                description: string | null;
                tenantId: string;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                mainPriceId: string | null;
                collectVat: boolean;
                vatPercentage: import("@prisma/client/runtime/library").Decimal | null;
                allowCoupons: boolean;
                successUrl: string | null;
                cancelUrl: string | null;
                customFields: import("@prisma/client/runtime/library").JsonValue | null;
                settings: import("@prisma/client/runtime/library").JsonValue | null;
                templateId: string | null;
                blocks: import("@prisma/client/runtime/library").JsonValue | null;
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
    }>;
    processOneClickUpsell(orderId: string, upsellOfferId: string, tenantId: string): Promise<{
        success: boolean;
        orderId: string;
        orderNumber: string;
        paymentIntentStatus: import("stripe").Stripe.PaymentIntent.Status;
    }>;
    declineUpsell(orderId: string, upsellOfferId: string, tenantId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
