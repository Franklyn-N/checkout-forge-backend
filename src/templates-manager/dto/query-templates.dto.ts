import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TemplateCategory } from './upload-template.dto';

export class QueryTemplatesDto {
  @ApiProperty({ enum: TemplateCategory, required: false })
  @IsOptional()
  @IsEnum(TemplateCategory)
  category?: TemplateCategory;

  @ApiProperty({ required: false })
  @IsOptional()
  status?: 'DRAFT' | 'PUBLISHED';
}
