import { PrismaService } from '../prisma/prisma.service';
import { TrackEventDto } from './dto';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    trackEvent(tenantId: string, dto: TrackEventDto): Promise<any>;
    getDashboard(tenantId: string, startDate?: Date, endDate?: Date): Promise<{
        summary: {
            revenue: any;
            orders: any;
            conversionRate: number;
            aov: number;
            pageViews: any;
            checkoutStarts: any;
        };
        charts: {
            revenueByDay: {
                date: string;
                revenue: number;
            }[];
            conversionsByDay: {
                date: string;
                conversions: number;
            }[];
        };
    }>;
    private getRevenueByDay;
    private getConversionsByDay;
    getFunnel(tenantId: string, startDate?: Date, endDate?: Date): Promise<{
        step: string;
        count: any;
        dropOff: number;
    }[]>;
}
