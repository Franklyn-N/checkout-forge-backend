import { AnalyticsService } from './analytics.service';
import { TrackEventDto } from './dto';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    trackEvent(dto: TrackEventDto, tenantId: string): Promise<{
        tenantId: string;
        id: string;
        createdAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        orderId: string | null;
        sessionId: string | null;
        eventType: string;
        pageUrl: string | null;
    }>;
    getDashboard(req: any, startDate?: string, endDate?: string): Promise<{
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
    getFunnel(req: any, startDate?: string, endDate?: string): Promise<{
        step: string;
        count: number;
        dropOff: number;
    }[]>;
}
