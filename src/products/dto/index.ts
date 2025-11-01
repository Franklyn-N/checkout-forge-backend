import { IsString, IsOptional, IsNumber, IsEnum, IsObject, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Premium Course' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Complete guide to mastering the topic' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  metadata?: any;
}

export enum PriceType {
  ONE_TIME = 'ONE_TIME',
  RECURRING = 'RECURRING',
}

export enum BillingInterval {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
}

export class CreatePriceDto {
  @ApiProperty({ example: 9900, description: 'Amount in smallest currency unit (pence)' })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiPropertyOptional({ example: 'GBP', default: 'GBP' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ enum: PriceType, default: PriceType.ONE_TIME })
  @IsOptional()
  @IsEnum(PriceType)
  type?: PriceType;

  @ApiPropertyOptional({ enum: BillingInterval })
  @IsOptional()
  @IsEnum(BillingInterval)
  interval?: BillingInterval;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  intervalCount?: number;

  @ApiPropertyOptional({ example: 14 })
  @IsOptional()
  @IsNumber()
  trialDays?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  stripePriceId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  metadata?: any;
}
