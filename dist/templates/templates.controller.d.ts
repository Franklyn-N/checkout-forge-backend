import { TemplatesService } from './templates.service';
import { CreateTemplateDto, UpdateTemplateDto, AssignTemplateDto, UpdateCheckoutBlocksDto } from './dto';
export declare class TemplatesController {
    private readonly templatesService;
    constructor(templatesService: TemplatesService);
    createTemplate(req: any, dto: CreateTemplateDto): Promise<any>;
    listTemplates(req: any, includePublic?: string): Promise<any>;
    getTemplate(req: any, id: string): Promise<any>;
    updateTemplate(req: any, id: string, dto: UpdateTemplateDto): Promise<any>;
    deleteTemplate(req: any, id: string): Promise<{
        message: string;
    }>;
    assignTemplate(req: any, dto: AssignTemplateDto): Promise<any>;
    updateCheckoutBlocks(req: any, dto: UpdateCheckoutBlocksDto): Promise<any>;
    getCheckoutBlocks(req: any, checkoutPageId: string): Promise<{
        blocks: any;
        template: any;
    }>;
}
