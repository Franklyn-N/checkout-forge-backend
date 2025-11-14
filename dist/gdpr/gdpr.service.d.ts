import { PrismaService } from '../prisma/prisma.service';
export declare class GdprService {
    private prisma;
    constructor(prisma: PrismaService);
    logConsent(params: {
        tenantId: string;
        customerId: string;
        consentType: string;
        consentText: string;
        granted: boolean;
        ipAddress?: string;
        userAgent?: string;
    }): Promise<any>;
    exportCustomerData(customerId: string, tenantId: string): Promise<{
        exportDate: string;
        customer: {
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            phone: any;
            billingAddress: any;
            shippingAddress: any;
            createdAt: any;
            gdprConsent: any;
            gdprConsentDate: any;
        };
        orders: any;
        subscriptions: any;
    }>;
    deleteCustomerData(customerId: string, tenantId: string): Promise<{
        success: boolean;
        message: string;
        customerId: string;
    }>;
}
