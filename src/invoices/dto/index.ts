import { IsString, IsOptional, IsDateString } from 'class-validator';

export class GenerateInvoiceDto {
  @IsString()
  orderId: string;

  @IsOptional()
  @IsDateString()
  dueAt?: string;
}
