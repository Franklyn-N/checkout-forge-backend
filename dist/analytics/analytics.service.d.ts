import { PrismaService } from '../prisma/prisma.service';
import { TrackEventDto } from './dto';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    trackEvent(tenantId: string, dto: TrackEventDto): Promise<{
        tenantId: string;
        id: string;
        createdAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        orderId: string | null;
        sessionId: string | null;
        eventType: string;
        pageUrl: string | null;
    }>;
    getDashboard(tenantId: string, startDate?: Date, endDate?: Date): Promise<{
        summary: {
            revenue: number;
            orders: number;
            conversionRate: number;
            aov: number;
            pageViews: number;
            checkoutStarts: number;
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
        count: number;
        dropOff: number;
    }[]>;
}
