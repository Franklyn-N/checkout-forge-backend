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
        totalOrders: any;
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
    }): Promise<any>;
    validateVATId(body: {
        vatId: string;
    }): Promise<{
        vatId: string;
        valid: boolean;
    }>;
}
