import { PrismaService } from '../prisma/prisma.service';
import { CreateTemplateDto, UpdateTemplateDto, AssignTemplateDto, UpdateCheckoutBlocksDto } from './dto';
export declare class TemplatesService {
    private prisma;
    constructor(prisma: PrismaService);
    createTemplate(tenantId: string, dto: CreateTemplateDto): Promise<{
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
    listTemplates(tenantId: string, includePublic?: boolean): Promise<{
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
    getTemplate(tenantId: string, templateId: string): Promise<{
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
    updateTemplate(tenantId: string, templateId: string, dto: UpdateTemplateDto): Promise<{
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
    deleteTemplate(tenantId: string, templateId: string): Promise<{
        message: string;
    }>;
    assignTemplate(tenantId: string, dto: AssignTemplateDto): Promise<{
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
    updateCheckoutBlocks(tenantId: string, dto: UpdateCheckoutBlocksDto): Promise<{
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
    getCheckoutBlocks(tenantId: string, checkoutPageId: string): Promise<{
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
