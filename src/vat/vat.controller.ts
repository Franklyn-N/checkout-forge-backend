import { Controller, Get, Post, Query, Body, UseGuards, Res, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { VatService } from './vat.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('vat')
@Controller('vat')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class VatController {
  constructor(private vatService: VatService) {}

  @Get('rate')
  @ApiOperation({ summary: 'Get VAT rate for country' })
  @ApiQuery({ name: 'countryCode', example: 'GB' })
  @ApiResponse({ status: 200, description: 'VAT rate retrieved' })
  async getVATRate(@Query('countryCode') countryCode: string) {
    return {
      countryCode,
      vatRate: this.vatService.getVATRate(countryCode),
    };
  }

  @Post('calculate')
  @ApiOperation({ summary: 'Calculate VAT for amount' })
  @ApiResponse({ status: 200, description: 'VAT calculated' })
  async calculateVAT(
    @Body() body: {
      amount: number;
      countryCode: string;
      vatId?: string;
      includeVAT?: boolean;
    },
  ) {
    return this.vatService.calculateVAT(body);
  }

  @Get('export')
  @Roles('OWNER', 'ADMIN', 'FINANCE')
  @ApiOperation({ summary: 'Export VAT report as CSV' })
  @ApiQuery({ name: 'from', example: '2025-01-01' })
  @ApiQuery({ name: 'to', example: '2025-12-31' })
  @ApiResponse({ status: 200, description: 'CSV file generated' })
  async exportVATReport(
    @CurrentUser() user: any,
    @Query('from') from: string,
    @Query('to') to: string,
    @Res() res: Response,
  ) {
    if (!from || !to) {
      throw new BadRequestException('from and to query parameters are required');
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    const csv = await this.vatService.exportVATReport({
      tenantId: user.tenantId,
      fromDate,
      toDate,
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="vat-report-${from}-${to}.csv"`);
    res.send(csv);
  }

  @Get('summary')
  @Roles('OWNER', 'ADMIN', 'FINANCE')
  @ApiOperation({ summary: 'Get VAT summary for date range' })
  @ApiQuery({ name: 'from', example: '2025-01-01' })
  @ApiQuery({ name: 'to', example: '2025-12-31' })
  @ApiResponse({ status: 200, description: 'VAT summary generated' })
  async getVATSummary(
    @CurrentUser() user: any,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    if (!from || !to) {
      throw new BadRequestException('from and to query parameters are required');
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    return this.vatService.getVATSummary({
      tenantId: user.tenantId,
      fromDate,
      toDate,
    });
  }

  @Post('customer/update')
  @ApiOperation({ summary: 'Update customer VAT information' })
  @ApiResponse({ status: 200, description: 'Customer VAT info updated' })
  async updateCustomerVATInfo(
    @CurrentUser() user: any,
    @Body() body: {
      customerId: string;
      vatId: string;
      country: string;
    },
  ) {
    return this.vatService.updateCustomerVATInfo({
      ...body,
      tenantId: user.tenantId,
    });
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate EU VAT ID' })
  @ApiResponse({ status: 200, description: 'VAT ID validation result' })
  async validateVATId(@Body() body: { vatId: string }) {
    return {
      vatId: body.vatId,
      valid: this.vatService.isValidEUVATId(body.vatId),
    };
  }
}
