import { IsString, IsOptional, IsBoolean, IsObject, IsArray } from 'class-validator';

export class CreateTemplateDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsArray()
  blocks: any[];

  @IsOptional()
  @IsObject()
  defaultSettings?: any;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

export class UpdateTemplateDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsArray()
  blocks?: any[];

  @IsOptional()
  @IsObject()
  defaultSettings?: any;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

export class AssignTemplateDto {
  @IsString()
  templateId: string;

  @IsString()
  checkoutPageId: string;
}

export class UpdateCheckoutBlocksDto {
  @IsString()
  checkoutPageId: string;

  @IsArray()
  blocks: any[];
}
