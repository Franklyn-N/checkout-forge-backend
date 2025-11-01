import { IsString, IsOptional, IsDateString, IsObject } from 'class-validator';

export class TrackEventDto {
  @IsString()
  eventType: string;

  @IsOptional()
  @IsString()
  orderId?: string;

  @IsOptional()
  @IsString()
  sessionId?: string;

  @IsOptional()
  @IsString()
  pageUrl?: string;

  @IsOptional()
  @IsObject()
  metadata?: any;
}

export class GetAnalyticsDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
