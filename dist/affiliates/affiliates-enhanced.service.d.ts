import { PrismaService } from '../prisma/prisma.service';
import { RegisterAffiliateDto, UpdateAffiliateDto, TrackClickDto, RecordConversionDto, ApproveCommissionDto, MarkCommissionPaidDto } from './dto';
export declare class AffiliatesEnhancedService {
    private prisma;
    constructor(prisma: PrismaService);
    registerAffiliate(tenantId: string, dto: RegisterAffiliateDto): Promise<any>;
    listAffiliates(tenantId: string, status?: string): Promise<any>;
    getAffiliate(tenantId: string, affiliateId: string): Promise<any>;
    updateAffiliate(tenantId: string, affiliateId: string, dto: UpdateAffiliateDto): Promise<any>;
    approveAffiliate(tenantId: string, affiliateId: string, userId: string): Promise<any>;
    rejectAffiliate(tenantId: string, affiliateId: string): Promise<any>;
    trackClick(tenantId: string, dto: TrackClickDto): Promise<{
        clickId: any;
        affiliateId: any;
    }>;
    recordConversion(tenantId: string, dto: RecordConversionDto): Promise<any>;
    getAffiliateDashboard(tenantId: string, affiliateId: string): Promise<{
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
    approveCommission(tenantId: string, dto: ApproveCommissionDto): Promise<any>;
    markCommissionPaid(tenantId: string, dto: MarkCommissionPaidDto): Promise<any>;
    exportPayoutCSV(tenantId: string, status?: string): Promise<string>;
}
