import { TemplatesManagerService } from './templates-manager.service';
import { UploadTemplateDto, QueryTemplatesDto, PublishTemplateDto } from './dto';
export declare class TemplatesManagerController {
    private readonly templatesService;
    constructor(templatesService: TemplatesManagerService);
    uploadTemplate(user: any, dto: UploadTemplateDto, files: {
        html?: Express.Multer.File[];
        thumbnail?: Express.Multer.File[];
    }): Promise<{
        name: string;
        description: string | null;
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        status: import(".prisma/client").$Enums.TemplateStatus;
        category: import(".prisma/client").$Enums.TemplateCategory;
        fileUrl: string;
        thumbnailUrl: string | null;
        currentVersion: string;
    }>;
    listTemplates(user: any, query: QueryTemplatesDto): Promise<({
        versions: {
            id: string;
            createdAt: Date;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            templateId: string;
            version: string;
            fileUrl: string;
            createdBy: string;
        }[];
    } & {
        name: string;
        description: string | null;
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        status: import(".prisma/client").$Enums.TemplateStatus;
        category: import(".prisma/client").$Enums.TemplateCategory;
        fileUrl: string;
        thumbnailUrl: string | null;
        currentVersion: string;
    })[]>;
    getTemplate(user: any, id: string): Promise<{
        versions: {
            id: string;
            createdAt: Date;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            templateId: string;
            version: string;
            fileUrl: string;
            createdBy: string;
        }[];
    } & {
        name: string;
        description: string | null;
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        status: import(".prisma/client").$Enums.TemplateStatus;
        category: import(".prisma/client").$Enums.TemplateCategory;
        fileUrl: string;
        thumbnailUrl: string | null;
        currentVersion: string;
    }>;
    publishTemplate(user: any, id: string, dto: PublishTemplateDto): Promise<{
        name: string;
        description: string | null;
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        status: import(".prisma/client").$Enums.TemplateStatus;
        category: import(".prisma/client").$Enums.TemplateCategory;
        fileUrl: string;
        thumbnailUrl: string | null;
        currentVersion: string;
    }>;
    deleteTemplate(user: any, id: string): Promise<{
        message: string;
    }>;
}
