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
exports.TemplatesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TemplatesService = class TemplatesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTemplate(tenantId, dto) {
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
    async listTemplates(tenantId, includePublic = true) {
        const where = {
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
    async getTemplate(tenantId, templateId) {
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
            throw new common_1.NotFoundException('Template not found');
        }
        return template;
    }
    async updateTemplate(tenantId, templateId, dto) {
        const template = await this.prisma.pageTemplate.findFirst({
            where: { id: templateId, tenantId },
        });
        if (!template) {
            throw new common_1.NotFoundException('Template not found');
        }
        return this.prisma.pageTemplate.update({
            where: { id: templateId },
            data: dto,
        });
    }
    async deleteTemplate(tenantId, templateId) {
        const template = await this.prisma.pageTemplate.findFirst({
            where: { id: templateId, tenantId },
        });
        if (!template) {
            throw new common_1.NotFoundException('Template not found');
        }
        await this.prisma.pageTemplate.delete({
            where: { id: templateId },
        });
        return { message: 'Template deleted successfully' };
    }
    async assignTemplate(tenantId, dto) {
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
            throw new common_1.NotFoundException('Template not found');
        }
        if (!checkoutPage) {
            throw new common_1.NotFoundException('Checkout page not found');
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
    async updateCheckoutBlocks(tenantId, dto) {
        const checkoutPage = await this.prisma.checkoutPage.findFirst({
            where: { id: dto.checkoutPageId, tenantId },
        });
        if (!checkoutPage) {
            throw new common_1.NotFoundException('Checkout page not found');
        }
        return this.prisma.checkoutPage.update({
            where: { id: dto.checkoutPageId },
            data: {
                blocks: dto.blocks,
            },
        });
    }
    async getCheckoutBlocks(tenantId, checkoutPageId) {
        const checkoutPage = await this.prisma.checkoutPage.findFirst({
            where: { id: checkoutPageId, tenantId },
            include: {
                template: true,
            },
        });
        if (!checkoutPage) {
            throw new common_1.NotFoundException('Checkout page not found');
        }
        return {
            blocks: checkoutPage.blocks || [],
            template: checkoutPage.template,
        };
    }
};
exports.TemplatesService = TemplatesService;
exports.TemplatesService = TemplatesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TemplatesService);
//# sourceMappingURL=templates.service.js.map