import { GdprService } from './gdpr.service';
export declare class GdprController {
    private gdprService;
    constructor(gdprService: GdprService);
    exportCustomerData(user: any, customerId: string): Promise<{
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
    deleteCustomerData(user: any, customerId: string): Promise<{
        success: boolean;
        message: string;
        customerId: string;
    }>;
}
