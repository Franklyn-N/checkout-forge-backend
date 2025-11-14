import { PrismaService } from '../prisma/prisma.service';
export declare class VatService {
    private prisma;
    constructor(prisma: PrismaService);
    getVATRate(countryCode: string): number;
    calculateVAT(params: {
        amount: number;
        countryCode: string;
        vatId?: string;
        includeVAT?: boolean;
    }): {
        netAmount: number;
        vatAmount: number;
        grossAmount: number;
        vatRate: number;
        vatApplied: boolean;
    };
    isValidEUVATId(vatId?: string): boolean;
    exportVATReport(params: {
        tenantId: string;
        fromDate: Date;
        toDate: Date;
    }): Promise<string>;
    getVATSummary(params: {
        tenantId: string;
        fromDate: Date;
        toDate: Date;
    }): Promise<{
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
    updateCustomerVATInfo(params: {
        customerId: string;
        tenantId: string;
        vatId: string;
        country: string;
    }): Promise<any>;
}
