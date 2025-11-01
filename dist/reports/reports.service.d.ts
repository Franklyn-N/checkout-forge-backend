import { PrismaService } from '../prisma/prisma.service';
export declare class ReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    getVatReport(tenantId: string, from: Date, to: Date): Promise<{
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
