import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from '../checkouts/stripe.service';
export declare class SubscriptionsEnhancedService {
    private prisma;
    private stripeService;
    constructor(prisma: PrismaService, stripeService: StripeService);
    createSubscription(params: {
        customerId: string;
        priceId: string;
        tenantId: string;
        trialDays?: number;
        paymentMethodId?: string;
    }): Promise<{
        subscription: {
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
        };
        clientSecret: any;
    }>;
    changePlan(subscriptionId: string, newPriceId: string, tenantId: string, prorate?: boolean): Promise<{
        success: boolean;
        subscription: import("stripe").Stripe.Response<import("stripe").Stripe.Subscription>;
    }>;
    retryFailedPayment(subscriptionId: string, tenantId: string): Promise<{
        success: boolean;
        invoiceStatus: import("stripe").Stripe.Invoice.Status;
    }>;
    createManualInvoice(params: {
        customerId: string;
        tenantId: string;
        items: Array<{
            description: string;
            amount: number;
        }>;
        dueDate?: Date;
    }): Promise<{
        success: boolean;
        invoice: import("stripe").Stripe.Response<import("stripe").Stripe.Invoice>;
        invoiceUrl: string;
    }>;
    getDunningStatus(subscriptionId: string, tenantId: string): Promise<{
        subscriptionStatus: import("stripe").Stripe.Subscription.Status;
        invoiceStatus: any;
        attemptCount: any;
        nextPaymentAttempt: Date;
        amountDue: any;
    }>;
}
