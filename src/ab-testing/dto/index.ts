import { IsString, IsOptional, IsInt, IsEnum, IsArray, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ABTestStatus } from '@prisma/client';
import { IsBoolean } from 'class-validator';

class VariantDto {
  @IsString()
  checkoutPageId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  isControl?: boolean;
}

export class CreateABTestDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(1)
  @Max(99)
  trafficSplit: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantDto)
  variants: VariantDto[];
}

export class UpdateABTestDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(99)
  trafficSplit?: number;

  @IsOptional()
  @IsEnum(ABTestStatus)
  status?: ABTestStatus;
}

export class AssignVariantDto {
  @IsString()
  abTestId: string;

  @IsString()
  sessionId: string;
}

export class RecordConversionDto {
  @IsString()
  abTestId: string;

  @IsString()
  variantId: string;

  @IsString()
  orderId: string;

  @IsOptional()
  @IsString()
  sessionId?: string;

  @IsInt()
  revenue: number;
}
