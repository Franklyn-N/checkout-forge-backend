import { AffiliateStatus } from '@prisma/client';
export declare class RegisterAffiliateDto {
    name: string;
    email: string;
    code: string;
}
export declare class UpdateAffiliateDto {
    name?: string;
    email?: string;
    commissionRate?: number;
    status?: AffiliateStatus;
}
export declare class TrackClickDto {
    affiliateCode: string;
    ip?: string;
    userAgent?: string;
    referrer?: string;
    landingPage?: string;
}
export declare class RecordConversionDto {
    affiliateId: string;
    orderId: string;
    orderTotal: number;
}
export declare class ApproveCommissionDto {
    commissionId: string;
    note?: string;
}
export declare class MarkCommissionPaidDto {
    commissionId: string;
    note?: string;
}
