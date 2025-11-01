import { PriceType, BillingInterval } from '@prisma/client';
export declare class CreateProductDto {
    name: string;
    description?: string;
    imageUrl?: string;
    isActive?: boolean;
}
export declare class UpdateProductDto {
    name?: string;
    description?: string;
    imageUrl?: string;
    isActive?: boolean;
}
export declare class CreatePriceDto {
    productId: string;
    amount: number;
    currency?: string;
    type: PriceType;
    interval?: BillingInterval;
    intervalCount?: number;
    trialDays?: number;
    isActive?: boolean;
}
export declare class UpdatePriceDto {
    amount?: number;
    isActive?: boolean;
    trialDays?: number;
}
export declare class ProcessRefundDto {
    orderId: string;
    amount: number;
    reason?: string;
}
