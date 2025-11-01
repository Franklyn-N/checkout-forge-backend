import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTemplateDto, UpdateTemplateDto, AssignTemplateDto, UpdateCheckoutBlocksDto } from './dto';

@Injectable()
export class TemplatesService {
  constructor(private prisma: PrismaService) {}

  async createTemplate(tenantId: string, dto: CreateTemplateDto) {
    return this.prisma.pageTemplate.create({
      data: {
        tenantId,
        name: dto.name,
        description: dto.description,
        thumbnail: dto.thumbnail,
        blocks: dto.blocks,
        defaultSettings: dto.defaultSettings,
        isPublic: dto.isPublic || false,
      },
    });
  }

  async listTemplates(tenantId: string, includePublic: boolean = true) {
    const where: any = {
      OR: [
        { tenantId },
      ],
    };

    if (includePublic) {
      where.OR.push({ isPublic: true });
    }

    return this.prisma.pageTemplate.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTemplate(tenantId: string, templateId: string) {
    const template = await this.prisma.pageTemplate.findFirst({
      where: {
        id: templateId,
        OR: [
          { tenantId },
          { isPublic: true },
        ],
      },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return template;
  }

  async updateTemplate(tenantId: string, templateId: string, dto: UpdateTemplateDto) {
    const template = await this.prisma.pageTemplate.findFirst({
      where: { id: templateId, tenantId },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return this.prisma.pageTemplate.update({
      where: { id: templateId },
      data: dto,
    });
  }

  async deleteTemplate(tenantId: string, templateId: string) {
    const template = await this.prisma.pageTemplate.findFirst({
      where: { id: templateId, tenantId },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    await this.prisma.pageTemplate.delete({
      where: { id: templateId },
    });

    return { message: 'Template deleted successfully' };
  }

  async assignTemplate(tenantId: string, dto: AssignTemplateDto) {
    const [template, checkoutPage] = await Promise.all([
      this.prisma.pageTemplate.findFirst({
        where: {
          id: dto.templateId,
          OR: [
            { tenantId },
            { isPublic: true },
          ],
        },
      }),
      this.prisma.checkoutPage.findFirst({
        where: { id: dto.checkoutPageId, tenantId },
      }),
    ]);

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    if (!checkoutPage) {
      throw new NotFoundException('Checkout page not found');
    }

    return this.prisma.checkoutPage.update({
      where: { id: dto.checkoutPageId },
      data: {
        templateId: dto.templateId,
        blocks: template.blocks,
        settings: template.defaultSettings,
      },
      include: {
        template: true,
      },
    });
  }

  async updateCheckoutBlocks(tenantId: string, dto: UpdateCheckoutBlocksDto) {
    const checkoutPage = await this.prisma.checkoutPage.findFirst({
      where: { id: dto.checkoutPageId, tenantId },
    });

    if (!checkoutPage) {
      throw new NotFoundException('Checkout page not found');
    }

    return this.prisma.checkoutPage.update({
      where: { id: dto.checkoutPageId },
      data: {
        blocks: dto.blocks,
      },
    });
  }

  async getCheckoutBlocks(tenantId: string, checkoutPageId: string) {
    const checkoutPage = await this.prisma.checkoutPage.findFirst({
      where: { id: checkoutPageId, tenantId },
      include: {
        template: true,
      },
    });

    if (!checkoutPage) {
      throw new NotFoundException('Checkout page not found');
    }

    return {
      blocks: checkoutPage.blocks || [],
      template: checkoutPage.template,
    };
  }
}
