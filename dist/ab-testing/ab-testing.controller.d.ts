import { ABTestingService } from './ab-testing.service';
import { CreateABTestDto, UpdateABTestDto, AssignVariantDto, RecordConversionDto } from './dto';
export declare class ABTestingController {
    private readonly abTestingService;
    constructor(abTestingService: ABTestingService);
    createABTest(req: any, dto: CreateABTestDto): Promise<{
        variants: ({
            checkoutPage: {
                name: string;
                description: string | null;
                tenantId: string;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                mainPriceId: string | null;
                collectVat: boolean;
                vatPercentage: import("@prisma/client/runtime/library").Decimal | null;
                allowCoupons: boolean;
                successUrl: string | null;
                cancelUrl: string | null;
                customFields: import("@prisma/client/runtime/library").JsonValue | null;
                settings: import("@prisma/client/runtime/library").JsonValue | null;
                templateId: string | null;
                blocks: import("@prisma/client/runtime/library").JsonValue | null;
            };
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            checkoutPageId: string;
            isControl: boolean;
            abTestId: string;
            revenue: number;
            views: number;
            conversions: number;
        })[];
    } & {
        name: string;
        description: string | null;
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ABTestStatus;
        trafficSplit: number;
        startedAt: Date | null;
        endedAt: Date | null;
        winnerVariantId: string | null;
    }>;
    listABTests(req: any, status?: string): Promise<({
        variants: ({
            checkoutPage: {
                name: string;
                description: string | null;
                tenantId: string;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                mainPriceId: string | null;
                collectVat: boolean;
                vatPercentage: import("@prisma/client/runtime/library").Decimal | null;
                allowCoupons: boolean;
                successUrl: string | null;
                cancelUrl: string | null;
                customFields: import("@prisma/client/runtime/library").JsonValue | null;
                settings: import("@prisma/client/runtime/library").JsonValue | null;
                templateId: string | null;
                blocks: import("@prisma/client/runtime/library").JsonValue | null;
            };
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            checkoutPageId: string;
            isControl: boolean;
            abTestId: string;
            revenue: number;
            views: number;
            conversions: number;
        })[];
    } & {
        name: string;
        description: string | null;
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ABTestStatus;
        trafficSplit: number;
        startedAt: Date | null;
        endedAt: Date | null;
        winnerVariantId: string | null;
    })[]>;
    getABTest(req: any, id: string): Promise<{
        variants: ({
            checkoutPage: {
                name: string;
                description: string | null;
                tenantId: string;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                mainPriceId: string | null;
                collectVat: boolean;
                vatPercentage: import("@prisma/client/runtime/library").Decimal | null;
                allowCoupons: boolean;
                successUrl: string | null;
                cancelUrl: string | null;
                customFields: import("@prisma/client/runtime/library").JsonValue | null;
                settings: import("@prisma/client/runtime/library").JsonValue | null;
                templateId: string | null;
                blocks: import("@prisma/client/runtime/library").JsonValue | null;
            };
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            checkoutPageId: string;
            isControl: boolean;
            abTestId: string;
            revenue: number;
            views: number;
            conversions: number;
        })[];
    } & {
        name: string;
        description: string | null;
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ABTestStatus;
        trafficSplit: number;
        startedAt: Date | null;
        endedAt: Date | null;
        winnerVariantId: string | null;
    }>;
    updateABTest(req: any, id: string, dto: UpdateABTestDto): Promise<{
        variants: ({
            checkoutPage: {
                name: string;
                description: string | null;
                tenantId: string;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                mainPriceId: string | null;
                collectVat: boolean;
                vatPercentage: import("@prisma/client/runtime/library").Decimal | null;
                allowCoupons: boolean;
                successUrl: string | null;
                cancelUrl: string | null;
                customFields: import("@prisma/client/runtime/library").JsonValue | null;
                settings: import("@prisma/client/runtime/library").JsonValue | null;
                templateId: string | null;
                blocks: import("@prisma/client/runtime/library").JsonValue | null;
            };
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            checkoutPageId: string;
            isControl: boolean;
            abTestId: string;
            revenue: number;
            views: number;
            conversions: number;
        })[];
    } & {
        name: string;
        description: string | null;
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ABTestStatus;
        trafficSplit: number;
        startedAt: Date | null;
        endedAt: Date | null;
        winnerVariantId: string | null;
    }>;
    startABTest(req: any, id: string): Promise<{
        variants: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            checkoutPageId: string;
            isControl: boolean;
            abTestId: string;
            revenue: number;
            views: number;
            conversions: number;
        }[];
    } & {
        name: string;
        description: string | null;
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ABTestStatus;
        trafficSplit: number;
        startedAt: Date | null;
        endedAt: Date | null;
        winnerVariantId: string | null;
    }>;
    pauseABTest(req: any, id: string): Promise<{
        name: string;
        description: string | null;
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ABTestStatus;
        trafficSplit: number;
        startedAt: Date | null;
        endedAt: Date | null;
        winnerVariantId: string | null;
    }>;
    completeABTest(req: any, id: string, winnerVariantId?: string): Promise<{
        variants: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            checkoutPageId: string;
            isControl: boolean;
            abTestId: string;
            revenue: number;
            views: number;
            conversions: number;
        }[];
    } & {
        name: string;
        description: string | null;
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ABTestStatus;
        trafficSplit: number;
        startedAt: Date | null;
        endedAt: Date | null;
        winnerVariantId: string | null;
    }>;
    assignVariant(req: any, dto: AssignVariantDto): Promise<{
        variantId: string;
        checkoutPageId: string;
        isControl: boolean;
    }>;
    recordConversion(req: any, dto: RecordConversionDto): Promise<{
        message: string;
    }>;
    getABTestResults(req: any, id: string): Promise<{
        abTest: {
            id: string;
            name: string;
            description: string;
            status: import(".prisma/client").$Enums.ABTestStatus;
            trafficSplit: number;
            startedAt: Date;
            endedAt: Date;
            winnerVariantId: string;
        };
        results: {
            variantId: string;
            name: string;
            isControl: boolean;
            checkoutPageId: string;
            checkoutPageName: string;
            views: number;
            conversions: number;
            conversionRate: number;
            revenue: number;
            aov: number;
        }[];
    }>;
}
