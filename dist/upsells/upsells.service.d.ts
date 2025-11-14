import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from '../checkouts/stripe.service';
export declare class UpsellsService {
    private prisma;
    private stripeService;
    constructor(prisma: PrismaService, stripeService: StripeService);
    getUpsellOffer(orderId: string, tenantId: string): Promise<{
        upsellOffer: any;
        price: any;
        product: any;
        customer: any;
        originalOrder: any;
    }>;
    processOneClickUpsell(orderId: string, upsellOfferId: string, tenantId: string): Promise<{
        success: boolean;
        orderId: any;
        orderNumber: any;
        paymentIntentStatus: import("stripe").Stripe.PaymentIntent.Status;
    }>;
    declineUpsell(orderId: string, upsellOfferId: string, tenantId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
