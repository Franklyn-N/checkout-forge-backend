import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ABTestingService } from './ab-testing.service';
import { CreateABTestDto, UpdateABTestDto, AssignVariantDto, RecordConversionDto } from './dto';

@Controller('ab-tests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ABTestingController {
  constructor(private readonly abTestingService: ABTestingService) {}

  @Post()
  @Roles('OWNER', 'ADMIN')
  async createABTest(@Req() req, @Body() dto: CreateABTestDto) {
    return this.abTestingService.createABTest(req.user.tenantId, dto);
  }

  @Get()
  @Roles('OWNER', 'ADMIN', 'FINANCE', 'SUPPORT')
  async listABTests(@Req() req, @Query('status') status?: string) {
    return this.abTestingService.listABTests(req.user.tenantId, status);
  }

  @Get(':id')
  @Roles('OWNER', 'ADMIN', 'FINANCE', 'SUPPORT')
  async getABTest(@Req() req, @Param('id') id: string) {
    return this.abTestingService.getABTest(req.user.tenantId, id);
  }

  @Put(':id')
  @Roles('OWNER', 'ADMIN')
  async updateABTest(@Req() req, @Param('id') id: string, @Body() dto: UpdateABTestDto) {
    return this.abTestingService.updateABTest(req.user.tenantId, id, dto);
  }

  @Post(':id/start')
  @Roles('OWNER', 'ADMIN')
  async startABTest(@Req() req, @Param('id') id: string) {
    return this.abTestingService.startABTest(req.user.tenantId, id);
  }

  @Post(':id/pause')
  @Roles('OWNER', 'ADMIN')
  async pauseABTest(@Req() req, @Param('id') id: string) {
    return this.abTestingService.pauseABTest(req.user.tenantId, id);
  }

  @Post(':id/complete')
  @Roles('OWNER', 'ADMIN')
  async completeABTest(
    @Req() req,
    @Param('id') id: string,
    @Body('winnerVariantId') winnerVariantId?: string,
  ) {
    return this.abTestingService.completeABTest(req.user.tenantId, id, winnerVariantId);
  }

  @Post('assign-variant')
  async assignVariant(@Req() req, @Body() dto: AssignVariantDto) {
    return this.abTestingService.assignVariant(req.user.tenantId, dto);
  }

  @Post('record-conversion')
  async recordConversion(@Req() req, @Body() dto: RecordConversionDto) {
    return this.abTestingService.recordConversion(req.user.tenantId, dto);
  }

  @Get(':id/results')
  @Roles('OWNER', 'ADMIN', 'FINANCE', 'SUPPORT')
  async getABTestResults(@Req() req, @Param('id') id: string) {
    return this.abTestingService.getABTestResults(req.user.tenantId, id);
  }
}
