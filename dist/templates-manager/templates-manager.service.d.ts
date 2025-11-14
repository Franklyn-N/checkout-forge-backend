import { PrismaService } from '../prisma/prisma.service';
import { S3UploadService } from './s3-upload.service';
import { TemplateValidatorService } from './template-validator.service';
import { UploadTemplateDto, QueryTemplatesDto, PublishTemplateDto } from './dto';
export declare class TemplatesManagerService {
    private prisma;
    private s3Upload;
    private validator;
    constructor(prisma: PrismaService, s3Upload: S3UploadService, validator: TemplateValidatorService);
    uploadTemplate(tenantId: string, userId: string, dto: UploadTemplateDto, htmlFile: Express.Multer.File, thumbnailFile?: Express.Multer.File): Promise<any>;
    listTemplates(tenantId: string, query: QueryTemplatesDto): Promise<any>;
    getTemplate(tenantId: string, templateId: string): Promise<any>;
    publishTemplate(tenantId: string, userId: string, templateId: string, dto: PublishTemplateDto): Promise<any>;
    deleteTemplate(tenantId: string, userId: string, templateId: string): Promise<{
        message: string;
    }>;
    private checkUserPermission;
}
