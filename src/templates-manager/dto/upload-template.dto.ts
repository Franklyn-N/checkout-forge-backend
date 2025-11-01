import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum TemplateCategory {
  SALES = 'SALES',
  PRODUCT = 'PRODUCT',
  CHECKOUT = 'CHECKOUT',
  WEBINAR = 'WEBINAR',
  PHYSICAL = 'PHYSICAL',
  CUSTOM = 'CUSTOM',
}

export class UploadTemplateDto {
  @ApiProperty({ description: 'Template name' })
  @IsString()
  name: string;

  @ApiProperty({ enum: TemplateCategory, description: 'Template category' })
  @IsEnum(TemplateCategory)
  category: TemplateCategory;

  @ApiProperty({ description: 'Template description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
