import { TemplatesManagerService } from './templates-manager.service';
import { UploadTemplateDto, QueryTemplatesDto, PublishTemplateDto } from './dto';
export declare class TemplatesManagerController {
    private readonly templatesService;
    constructor(templatesService: TemplatesManagerService);
    uploadTemplate(user: any, dto: UploadTemplateDto, files: {
        html?: Express.Multer.File[];
        thumbnail?: Express.Multer.File[];
    }): Promise<any>;
    listTemplates(user: any, query: QueryTemplatesDto): Promise<any>;
    getTemplate(user: any, id: string): Promise<any>;
    publishTemplate(user: any, id: string, dto: PublishTemplateDto): Promise<any>;
    deleteTemplate(user: any, id: string): Promise<{
        message: string;
    }>;
}
