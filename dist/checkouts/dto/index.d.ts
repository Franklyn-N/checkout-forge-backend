export declare class CreateCheckoutSessionDto {
    priceId: string;
    customerEmail: string;
    customerName?: string;
    quantity?: number;
    applyVat?: boolean;
    couponCode?: string;
    orderBumpIds?: string[];
}
