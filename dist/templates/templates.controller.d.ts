import { TemplatesService } from './templates.service';
import { CreateTemplateDto, UpdateTemplateDto, AssignTemplateDto, UpdateCheckoutBlocksDto } from './dto';
export declare class TemplatesController {
    private readonly templatesService;
    constructor(templatesService: TemplatesService);
    createTemplate(req: any, dto: CreateTemplateDto): Promise<{
        name: string;
        description: string | null;
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        blocks: import("@prisma/client/runtime/library").JsonValue;
        thumbnail: string | null;
        defaultSettings: import("@prisma/client/runtime/library").JsonValue | null;
        isPublic: boolean;
    }>;
    listTemplates(req: any, includePublic?: string): Promise<{
        name: string;
        description: string | null;
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        blocks: import("@prisma/client/runtime/library").JsonValue;
        thumbnail: string | null;
        defaultSettings: import("@prisma/client/runtime/library").JsonValue | null;
        isPublic: boolean;
    }[]>;
    getTemplate(req: any, id: string): Promise<{
        name: string;
        description: string | null;
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        blocks: import("@prisma/client/runtime/library").JsonValue;
        thumbnail: string | null;
        defaultSettings: import("@prisma/client/runtime/library").JsonValue | null;
        isPublic: boolean;
    }>;
    updateTemplate(req: any, id: string, dto: UpdateTemplateDto): Promise<{
        name: string;
        description: string | null;
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        blocks: import("@prisma/client/runtime/library").JsonValue;
        thumbnail: string | null;
        defaultSettings: import("@prisma/client/runtime/library").JsonValue | null;
        isPublic: boolean;
    }>;
    deleteTemplate(req: any, id: string): Promise<{
        message: string;
    }>;
    assignTemplate(req: any, dto: AssignTemplateDto): Promise<{
        template: {
            name: string;
            description: string | null;
            tenantId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            blocks: import("@prisma/client/runtime/library").JsonValue;
            thumbnail: string | null;
            defaultSettings: import("@prisma/client/runtime/library").JsonValue | null;
            isPublic: boolean;
        };
    } & {
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
    }>;
    updateCheckoutBlocks(req: any, dto: UpdateCheckoutBlocksDto): Promise<{
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
    }>;
    getCheckoutBlocks(req: any, checkoutPageId: string): Promise<{
        blocks: string | number | true | import("@prisma/client/runtime/library").JsonObject | import("@prisma/client/runtime/library").JsonArray;
        template: {
            name: string;
            description: string | null;
            tenantId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            blocks: import("@prisma/client/runtime/library").JsonValue;
            thumbnail: string | null;
            defaultSettings: import("@prisma/client/runtime/library").JsonValue | null;
            isPublic: boolean;
        };
    }>;
}
