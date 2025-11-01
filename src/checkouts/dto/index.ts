import { IsString, IsEmail, IsOptional, IsNumber, IsBoolean, IsArray, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCheckoutSessionDto {
  @ApiProperty({ example: 'price-uuid' })
  @IsString()
  priceId: string;

  @ApiProperty({ example: 'customer@example.com' })
  @IsEmail()
  customerEmail: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  applyVat?: boolean;

  @ApiPropertyOptional({ example: 'SAVE10' })
  @IsOptional()
  @IsString()
  couponCode?: string;

  @ApiPropertyOptional({ type: [String], example: ['bump-uuid-1'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  orderBumpIds?: string[];
}
