export declare class CreateProductDto {
    name: string;
    description?: string;
    imageUrl?: string;
    metadata?: any;
}
export declare enum PriceType {
    ONE_TIME = "ONE_TIME",
    RECURRING = "RECURRING"
}
export declare enum BillingInterval {
    DAY = "DAY",
    WEEK = "WEEK",
    MONTH = "MONTH",
    YEAR = "YEAR"
}
export declare class CreatePriceDto {
    amount: number;
    currency?: string;
    type?: PriceType;
    interval?: BillingInterval;
    intervalCount?: number;
    trialDays?: number;
    stripePriceId?: string;
    metadata?: any;
}
