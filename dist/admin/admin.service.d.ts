import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, CreatePriceDto, UpdatePriceDto, ProcessRefundDto } from './dto';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    createProduct(tenantId: string, dto: CreateProductDto): Promise<{
        prices: {
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
        }[];
    } & {
        name: string;
        description: string | null;
        tenantId: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    updateProduct(tenantId: string, productId: string, dto: UpdateProductDto): Promise<{
        prices: {
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
        }[];
    } & {
        name: string;
        description: string | null;
        tenantId: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    deleteProduct(tenantId: string, productId: string): Promise<{
        message: string;
    }>;
    getProduct(tenantId: string, productId: string): Promise<{
        prices: {
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
        }[];
    } & {
        name: string;
        description: string | null;
        tenantId: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    listProducts(tenantId: string, page?: number, limit?: number): Promise<{
        data: ({
            prices: {
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
            }[];
        } & {
            name: string;
            description: string | null;
            tenantId: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            imageUrl: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    createPrice(tenantId: string, dto: CreatePriceDto): Promise<{
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
    }>;
    updatePrice(tenantId: string, priceId: string, dto: UpdatePriceDto): Promise<{
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
    }>;
    deletePrice(tenantId: string, priceId: string): Promise<{
        message: string;
    }>;
    listOrders(tenantId: string, page?: number, limit?: number, status?: string): Promise<{
        data: ({
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
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getOrder(tenantId: string, orderId: string): Promise<{
        checkoutPage: {
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
    processRefund(tenantId: string, dto: ProcessRefundDto, userId: string): Promise<{
        id: string;
        createdAt: Date;
        amount: number;
        orderId: string;
        reason: string | null;
        stripeRefundId: string | null;
        processedBy: string | null;
    }>;
    listSubscriptions(tenantId: string, page?: number, limit?: number, status?: string): Promise<{
        data: ({
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
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    cancelSubscription(tenantId: string, subscriptionId: string): Promise<{
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
    getDunningDashboard(tenantId: string): Promise<{
        stats: {
            totalPastDue: number;
            totalRevenue: number;
        };
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
        })[];
    }>;
}
