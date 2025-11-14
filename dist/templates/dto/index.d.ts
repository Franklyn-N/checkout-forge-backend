export declare class CreateTemplateDto {
    name: string;
    description?: string;
    thumbnail?: string;
    blocks: any[];
    defaultSettings?: any;
    isPublic?: boolean;
}
export declare class UpdateTemplateDto {
    name?: string;
    description?: string;
    thumbnail?: string;
    blocks?: any[];
    defaultSettings?: any;
    isPublic?: boolean;
}
export declare class AssignTemplateDto {
    templateId: string;
    checkoutPageId: string;
}
export declare class UpdateCheckoutBlocksDto {
    checkoutPageId: string;
    blocks: any[];
}
