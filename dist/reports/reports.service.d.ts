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
            totalOrders: any;
            totalNet: any;
            totalVat: any;
            totalGross: any;
            currency: string;
        };
        orders: any;
    }>;
}
