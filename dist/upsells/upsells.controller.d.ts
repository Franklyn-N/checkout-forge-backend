import { UpsellsService } from './upsells.service';
export declare class UpsellsController {
    private upsellsService;
    constructor(upsellsService: UpsellsService);
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
