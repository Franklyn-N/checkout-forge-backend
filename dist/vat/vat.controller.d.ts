import { Response } from 'express';
import { VatService } from './vat.service';
export declare class VatController {
    private vatService;
    constructor(vatService: VatService);
    getVATRate(countryCode: string): Promise<{
        countryCode: string;
        vatRate: number;
    }>;
    calculateVAT(body: {
        amount: number;
        countryCode: string;
        vatId?: string;
        includeVAT?: boolean;
    }): Promise<{
        netAmount: number;
        vatAmount: number;
        grossAmount: number;
        vatRate: number;
        vatApplied: boolean;
    }>;
    exportVATReport(user: any, from: string, to: string, res: Response): Promise<void>;
    getVATSummary(user: any, from: string, to: string): Promise<{
        totalOrders: number;
        totalNet: number;
        totalVAT: number;
        totalGross: number;
        byCountry: Record<string, {
            count: number;
            net: number;
            vat: number;
            gross: number;
        }>;
        b2bZeroRated: {
            count: number;
            net: number;
        };
    }>;
    updateCustomerVATInfo(user: any, body: {
        customerId: string;
        vatId: string;
        country: string;
    }): Promise<{
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
    }>;
    validateVATId(body: {
        vatId: string;
    }): Promise<{
        vatId: string;
        valid: boolean;
    }>;
}
