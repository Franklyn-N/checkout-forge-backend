import { PrismaService } from '../prisma/prisma.service';
import { S3UploadService } from './s3-upload.service';
import { TemplateValidatorService } from './template-validator.service';
import { UploadTemplateDto, QueryTemplatesDto, PublishTemplateDto } from './dto';
export declare class TemplatesManagerService {
    private prisma;
    private s3Upload;
    private validator;
    constructor(prisma: PrismaService, s3Upload: S3UploadService, validator: TemplateValidatorService);
    uploadTemplate(tenantId: string, userId: string, dto: UploadTemplateDto, htmlFile: Express.Multer.File, thumbnailFile?: Express.Multer.File): Promise<{
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
    listTemplates(tenantId: string, query: QueryTemplatesDto): Promise<({
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
    getTemplate(tenantId: string, templateId: string): Promise<{
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
    publishTemplate(tenantId: string, userId: string, templateId: string, dto: PublishTemplateDto): Promise<{
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
    deleteTemplate(tenantId: string, userId: string, templateId: string): Promise<{
        message: string;
    }>;
    private checkUserPermission;
}
