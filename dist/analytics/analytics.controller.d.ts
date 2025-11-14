import { AnalyticsService } from './analytics.service';
import { TrackEventDto } from './dto';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    trackEvent(dto: TrackEventDto, tenantId: string): Promise<any>;
    getDashboard(req: any, startDate?: string, endDate?: string): Promise<{
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
    getFunnel(req: any, startDate?: string, endDate?: string): Promise<{
        step: string;
        count: any;
        dropOff: number;
    }[]>;
}
