export declare enum TemplateCategory {
    SALES = "SALES",
    PRODUCT = "PRODUCT",
    CHECKOUT = "CHECKOUT",
    WEBINAR = "WEBINAR",
    PHYSICAL = "PHYSICAL",
    CUSTOM = "CUSTOM"
}
export declare class UploadTemplateDto {
    name: string;
    category: TemplateCategory;
    description?: string;
    metadata?: Record<string, any>;
}
