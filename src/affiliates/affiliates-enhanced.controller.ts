import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AffiliatesEnhancedService } from './affiliates-enhanced.service';
import {
  RegisterAffiliateDto,
  UpdateAffiliateDto,
  TrackClickDto,
  RecordConversionDto,
  ApproveCommissionDto,
  MarkCommissionPaidDto,
} from './dto';

@Controller('affiliates')
export class AffiliatesEnhancedController {
  constructor(private readonly affiliatesService: AffiliatesEnhancedService) {}

  @Post('register')
  async registerAffiliate(@Body() dto: RegisterAffiliateDto, @Query('tenantId') tenantId: string) {
    return this.affiliatesService.registerAffiliate(tenantId, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN', 'FINANCE')
  async listAffiliates(@Req() req, @Query('status') status?: string) {
    return this.affiliatesService.listAffiliates(req.user.tenantId, status);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN', 'FINANCE')
  async getAffiliate(@Req() req, @Param('id') id: string) {
    return this.affiliatesService.getAffiliate(req.user.tenantId, id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  async updateAffiliate(@Req() req, @Param('id') id: string, @Body() dto: UpdateAffiliateDto) {
    return this.affiliatesService.updateAffiliate(req.user.tenantId, id, dto);
  }

  @Post(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  async approveAffiliate(@Req() req, @Param('id') id: string) {
    return this.affiliatesService.approveAffiliate(req.user.tenantId, id, req.user.userId);
  }

  @Post(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  async rejectAffiliate(@Req() req, @Param('id') id: string) {
    return this.affiliatesService.rejectAffiliate(req.user.tenantId, id);
  }

  @Post('track-click')
  async trackClick(@Body() dto: TrackClickDto, @Query('tenantId') tenantId: string) {
    return this.affiliatesService.trackClick(tenantId, dto);
  }

  @Post('record-conversion')
  async recordConversion(@Body() dto: RecordConversionDto, @Query('tenantId') tenantId: string) {
    return this.affiliatesService.recordConversion(tenantId, dto);
  }

  @Get(':id/dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN', 'FINANCE')
  async getAffiliateDashboard(@Req() req, @Param('id') id: string) {
    return this.affiliatesService.getAffiliateDashboard(req.user.tenantId, id);
  }

  @Post('commissions/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN', 'FINANCE')
  async approveCommission(@Req() req, @Body() dto: ApproveCommissionDto) {
    return this.affiliatesService.approveCommission(req.user.tenantId, dto);
  }

  @Post('commissions/mark-paid')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN', 'FINANCE')
  async markCommissionPaid(@Req() req, @Body() dto: MarkCommissionPaidDto) {
    return this.affiliatesService.markCommissionPaid(req.user.tenantId, dto);
  }

  @Get('export/payouts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN', 'FINANCE')
  async exportPayouts(@Req() req, @Res() res: Response, @Query('status') status?: string) {
    const csv = await this.affiliatesService.exportPayoutCSV(req.user.tenantId, status);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=affiliate-payouts.csv');
    res.send(csv);
  }
}
