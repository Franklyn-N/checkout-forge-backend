import { ABTestStatus } from '@prisma/client';
declare class VariantDto {
    checkoutPageId: string;
    name: string;
    isControl?: boolean;
}
export declare class CreateABTestDto {
    name: string;
    description?: string;
    trafficSplit: number;
    variants: VariantDto[];
}
export declare class UpdateABTestDto {
    name?: string;
    description?: string;
    trafficSplit?: number;
    status?: ABTestStatus;
}
export declare class AssignVariantDto {
    abTestId: string;
    sessionId: string;
}
export declare class RecordConversionDto {
    abTestId: string;
    variantId: string;
    orderId: string;
    sessionId?: string;
    revenue: number;
}
export {};
