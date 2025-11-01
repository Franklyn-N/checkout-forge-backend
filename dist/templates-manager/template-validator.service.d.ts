export declare class TemplateValidatorService {
    validateHtmlTemplate(html: string): {
        valid: boolean;
        errors: string[];
    };
    validateMetadata(metadata: any): {
        valid: boolean;
        errors: string[];
    };
    extractPlaceholders(html: string): string[];
}
