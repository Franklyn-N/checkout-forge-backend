import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { S3UploadService } from './s3-upload.service';
import { TemplateValidatorService } from './template-validator.service';
import { UploadTemplateDto, QueryTemplatesDto, PublishTemplateDto } from './dto';

@Injectable()
export class TemplatesManagerService {
  constructor(
    private prisma: PrismaService,
    private s3Upload: S3UploadService,
    private validator: TemplateValidatorService,
  ) {}

  async uploadTemplate(
    tenantId: string,
    userId: string,
    dto: UploadTemplateDto,
    htmlFile: Express.Multer.File,
    thumbnailFile?: Express.Multer.File,
  ) {
    await this.checkUserPermission(userId, tenantId);

    const htmlContent = htmlFile.buffer.toString('utf-8');

    const validation = this.validator.validateHtmlTemplate(htmlContent);
    if (!validation.valid) {
      throw new BadRequestException(`Template validation failed: ${validation.errors.join(', ')}`);
    }

    const metadataValidation = this.validator.validateMetadata(dto.metadata);
    if (!metadataValidation.valid) {
      throw new BadRequestException(`Metadata validation failed: ${metadataValidation.errors.join(', ')}`);
    }

    const fileUrl = await this.s3Upload.uploadFile(htmlFile, tenantId, 'templates');
    let thumbnailUrl: string | undefined;

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

  async listTemplates(tenantId: string, query: QueryTemplatesDto) {
    const where: any = { tenantId };

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

  async getTemplate(tenantId: string, templateId: string) {
    const template = await this.prisma.template.findFirst({
      where: { id: templateId, tenantId },
      include: {
        versions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return template;
  }

  async publishTemplate(
    tenantId: string,
    userId: string,
    templateId: string,
    dto: PublishTemplateDto,
  ) {
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
      throw new BadRequestException(`Version ${dto.version} already exists for this template`);
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

  async deleteTemplate(tenantId: string, userId: string, templateId: string) {
    await this.checkUserPermission(userId, tenantId);

    const template = await this.getTemplate(tenantId, templateId);

    await this.prisma.template.delete({
      where: { id: templateId },
    });

    return { message: 'Template deleted successfully' };
  }

  private async checkUserPermission(userId: string, tenantId: string) {
    const user = await this.prisma.userAccount.findUnique({
      where: { id: userId },
    });

    if (!user || user.tenantId !== tenantId) {
      throw new ForbiddenException('Access denied');
    }
  }
}
