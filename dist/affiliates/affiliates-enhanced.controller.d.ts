import { Response } from 'express';
import { AffiliatesEnhancedService } from './affiliates-enhanced.service';
import { RegisterAffiliateDto, UpdateAffiliateDto, TrackClickDto, RecordConversionDto, ApproveCommissionDto, MarkCommissionPaidDto } from './dto';
export declare class AffiliatesEnhancedController {
    private readonly affiliatesService;
    constructor(affiliatesService: AffiliatesEnhancedService);
    registerAffiliate(dto: RegisterAffiliateDto, tenantId: string): Promise<any>;
    listAffiliates(req: any, status?: string): Promise<any>;
    getAffiliate(req: any, id: string): Promise<any>;
    updateAffiliate(req: any, id: string, dto: UpdateAffiliateDto): Promise<any>;
    approveAffiliate(req: any, id: string): Promise<any>;
    rejectAffiliate(req: any, id: string): Promise<any>;
    trackClick(dto: TrackClickDto, tenantId: string): Promise<{
        clickId: any;
        affiliateId: any;
    }>;
    recordConversion(dto: RecordConversionDto, tenantId: string): Promise<any>;
    getAffiliateDashboard(req: any, id: string): Promise<{
        affiliate: {
            id: any;
            name: any;
            code: any;
            commissionRate: any;
            status: any;
        };
        stats: {
            totalClicks: any;
            totalConversions: any;
            totalSales: any;
            totalCommission: any;
            pendingCommissions: any;
            approvedCommissions: any;
            paidCommissions: any;
            conversionRate: number;
        };
        recentCommissions: any;
        recentClicks: any;
    }>;
    approveCommission(req: any, dto: ApproveCommissionDto): Promise<any>;
    markCommissionPaid(req: any, dto: MarkCommissionPaidDto): Promise<any>;
    exportPayouts(req: any, res: Response, status?: string): Promise<void>;
}
