import { ReportsService } from './reports.service';
export declare class ReportsController {
    private reportsService;
    constructor(reportsService: ReportsService);
    getVatReport(user: any, from: string, to: string): Promise<{
        period: {
            from: string;
            to: string;
        };
        summary: {
            totalOrders: number;
            totalNet: number;
            totalVat: number;
            totalGross: number;
            currency: string;
        };
        orders: {
            orderNumber: string;
            date: Date;
            customer: {
                email: string;
                name: string;
            };
            net: number;
            vat: number;
            gross: number;
        }[];
    }>;
}
