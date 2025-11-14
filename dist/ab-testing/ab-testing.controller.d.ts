import { ABTestingService } from './ab-testing.service';
import { CreateABTestDto, UpdateABTestDto, AssignVariantDto, RecordConversionDto } from './dto';
export declare class ABTestingController {
    private readonly abTestingService;
    constructor(abTestingService: ABTestingService);
    createABTest(req: any, dto: CreateABTestDto): Promise<any>;
    listABTests(req: any, status?: string): Promise<any>;
    getABTest(req: any, id: string): Promise<any>;
    updateABTest(req: any, id: string, dto: UpdateABTestDto): Promise<any>;
    startABTest(req: any, id: string): Promise<any>;
    pauseABTest(req: any, id: string): Promise<any>;
    completeABTest(req: any, id: string, winnerVariantId?: string): Promise<any>;
    assignVariant(req: any, dto: AssignVariantDto): Promise<{
        variantId: any;
        checkoutPageId: any;
        isControl: any;
    }>;
    recordConversion(req: any, dto: RecordConversionDto): Promise<{
        message: string;
    }>;
    getABTestResults(req: any, id: string): Promise<{
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
