import { PrismaService } from '../prisma/prisma.service';
import { CreateTemplateDto, UpdateTemplateDto, AssignTemplateDto, UpdateCheckoutBlocksDto } from './dto';
export declare class TemplatesService {
    private prisma;
    constructor(prisma: PrismaService);
    createTemplate(tenantId: string, dto: CreateTemplateDto): Promise<any>;
    listTemplates(tenantId: string, includePublic?: boolean): Promise<any>;
    getTemplate(tenantId: string, templateId: string): Promise<any>;
    updateTemplate(tenantId: string, templateId: string, dto: UpdateTemplateDto): Promise<any>;
    deleteTemplate(tenantId: string, templateId: string): Promise<{
        message: string;
    }>;
    assignTemplate(tenantId: string, dto: AssignTemplateDto): Promise<any>;
    updateCheckoutBlocks(tenantId: string, dto: UpdateCheckoutBlocksDto): Promise<any>;
    getCheckoutBlocks(tenantId: string, checkoutPageId: string): Promise<{
        blocks: any;
        template: any;
    }>;
}
