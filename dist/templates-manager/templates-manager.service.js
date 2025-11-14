"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplatesManagerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const s3_upload_service_1 = require("./s3-upload.service");
const template_validator_service_1 = require("./template-validator.service");
let TemplatesManagerService = class TemplatesManagerService {
    constructor(prisma, s3Upload, validator) {
        this.prisma = prisma;
        this.s3Upload = s3Upload;
        this.validator = validator;
    }
    async uploadTemplate(tenantId, userId, dto, htmlFile, thumbnailFile) {
        await this.checkUserPermission(userId, tenantId);
        const htmlContent = htmlFile.buffer.toString('utf-8');
        const validation = this.validator.validateHtmlTemplate(htmlContent);
        if (!validation.valid) {
            throw new common_1.BadRequestException(`Template validation failed: ${validation.errors.join(', ')}`);
        }
        const metadataValidation = this.validator.validateMetadata(dto.metadata);
        if (!metadataValidation.valid) {
            throw new common_1.BadRequestException(`Metadata validation failed: ${metadataValidation.errors.join(', ')}`);
        }
        const fileUrl = await this.s3Upload.uploadFile(htmlFile, tenantId, 'templates');
        let thumbnailUrl;
        if (thumbnailFile) {
            thumbnailUrl = await this.s3Upload.uploadFile(thumbnailFile, tenantId, 'thumbnails');
        }
        const placeholders = this.validator.extractPlaceholders(htmlContent);
        const enhancedMetadata = {
            ...dto.metadata,
            placeholders,
            uploadedBy: userId,
            originalFileName: htmlFile.originalname,
        };
        const template = await this.prisma.template.create({
            data: {
                tenantId,
                name: dto.name,
                category: dto.category,
                description: dto.description,
                fileUrl,
                thumbnailUrl,
                metadata: enhancedMetadata,
                status: 'DRAFT',
                currentVersion: '0.0.1',
            },
        });
        await this.prisma.templateVersion.create({
            data: {
                templateId: template.id,
                version: '0.0.1',
                fileUrl,
                metadata: enhancedMetadata,
                createdBy: userId,
            },
        });
        return template;
    }
    async listTemplates(tenantId, query) {
        const where = { tenantId };
        if (query.category) {
            where.category = query.category;
        }
        if (query.status) {
            where.status = query.status;
        }
        return this.prisma.template.findMany({
            where,
            include: {
                versions: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getTemplate(tenantId, templateId) {
        const template = await this.prisma.template.findFirst({
            where: { id: templateId, tenantId },
            include: {
                versions: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!template) {
            throw new common_1.NotFoundException('Template not found');
        }
        return template;
    }
    async publishTemplate(tenantId, userId, templateId, dto) {
        await this.checkUserPermission(userId, tenantId);
        const template = await this.getTemplate(tenantId, templateId);
        const existingVersion = await this.prisma.templateVersion.findUnique({
            where: {
                templateId_version: {
                    templateId: template.id,
                    version: dto.version,
                },
            },
        });
        if (existingVersion) {
            throw new common_1.BadRequestException(`Version ${dto.version} already exists for this template`);
        }
        await this.prisma.templateVersion.create({
            data: {
                templateId: template.id,
                version: dto.version,
                fileUrl: template.fileUrl,
                metadata: template.metadata,
                createdBy: userId,
            },
        });
        return this.prisma.template.update({
            where: { id: templateId },
            data: {
                status: 'PUBLISHED',
                currentVersion: dto.version,
            },
        });
    }
    async deleteTemplate(tenantId, userId, templateId) {
        await this.checkUserPermission(userId, tenantId);
        const template = await this.getTemplate(tenantId, templateId);
        await this.prisma.template.delete({
            where: { id: templateId },
        });
        return { message: 'Template deleted successfully' };
    }
    async checkUserPermission(userId, tenantId) {
        const user = await this.prisma.userAccount.findUnique({
            where: { id: userId },
        });
        if (!user || user.tenantId !== tenantId) {
            throw new common_1.ForbiddenException('Access denied');
        }
    }
};
exports.TemplatesManagerService = TemplatesManagerService;
exports.TemplatesManagerService = TemplatesManagerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        s3_upload_service_1.S3UploadService,
        template_validator_service_1.TemplateValidatorService])
], TemplatesManagerService);
//# sourceMappingURL=templates-manager.service.js.map