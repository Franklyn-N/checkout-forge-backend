import { PrismaService } from '../prisma/prisma.service';
import { CreateABTestDto, UpdateABTestDto, AssignVariantDto, RecordConversionDto } from './dto';
export declare class ABTestingService {
    private prisma;
    constructor(prisma: PrismaService);
    createABTest(tenantId: string, dto: CreateABTestDto): Promise<any>;
    listABTests(tenantId: string, status?: string): Promise<any>;
    getABTest(tenantId: string, abTestId: string): Promise<any>;
    updateABTest(tenantId: string, abTestId: string, dto: UpdateABTestDto): Promise<any>;
    startABTest(tenantId: string, abTestId: string): Promise<any>;
    pauseABTest(tenantId: string, abTestId: string): Promise<any>;
    completeABTest(tenantId: string, abTestId: string, winnerVariantId?: string): Promise<any>;
    assignVariant(tenantId: string, dto: AssignVariantDto): Promise<{
        variantId: any;
        checkoutPageId: any;
        isControl: any;
    }>;
    recordConversion(tenantId: string, dto: RecordConversionDto): Promise<{
        message: string;
    }>;
    getABTestResults(tenantId: string, abTestId: string): Promise<{
        abTest: {
            id: any;
            name: any;
            description: any;
            status: any;
            trafficSplit: any;
            startedAt: any;
            endedAt: any;
            winnerVariantId: any;
        };
        results: any;
    }>;
}
