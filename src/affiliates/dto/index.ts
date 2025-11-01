import { IsString, IsOptional, IsEmail, IsNumber, IsEnum, Min, Max } from 'class-validator';
import { AffiliateStatus, CommissionStatus } from '@prisma/client';

export class RegisterAffiliateDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  code: string;
}

export class UpdateAffiliateDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  commissionRate?: number;

  @IsOptional()
  @IsEnum(AffiliateStatus)
  status?: AffiliateStatus;
}

export class TrackClickDto {
  @IsString()
  affiliateCode: string;

  @IsOptional()
  @IsString()
  ip?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;

  @IsOptional()
  @IsString()
  referrer?: string;

  @IsOptional()
  @IsString()
  landingPage?: string;
}

export class RecordConversionDto {
  @IsString()
  affiliateId: string;

  @IsString()
  orderId: string;

  @IsNumber()
  @Min(0)
  orderTotal: number;
}

export class ApproveCommissionDto {
  @IsString()
  commissionId: string;

  @IsOptional()
  @IsString()
  note?: string;
}

export class MarkCommissionPaidDto {
  @IsString()
  commissionId: string;

  @IsOptional()
  @IsString()
  note?: string;
}
