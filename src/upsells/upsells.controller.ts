import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UpsellsService } from './upsells.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('upsells')
@Controller('upsells')
export class UpsellsController {
  constructor(private upsellsService: UpsellsService) {}

  @Get('offer/:orderId')
  @ApiOperation({ summary: 'Get post-purchase upsell offer for order' })
  @ApiResponse({ status: 200, description: 'Upsell offer retrieved' })
  async getUpsellOffer(
    @Param('orderId') orderId: string,
    @Query('tenantId') tenantId: string,
  ) {
    return this.upsellsService.getUpsellOffer(orderId, tenantId);
  }

  @Post('process/:orderId/:upsellOfferId')
  @ApiOperation({ summary: 'Process one-click upsell with saved payment method' })
  @ApiResponse({ status: 201, description: 'Upsell processed' })
  @ApiResponse({ status: 400, description: 'Payment failed' })
  async processOneClickUpsell(
    @Param('orderId') orderId: string,
    @Param('upsellOfferId') upsellOfferId: string,
    @Query('tenantId') tenantId: string,
  ) {
    return this.upsellsService.processOneClickUpsell(orderId, upsellOfferId, tenantId);
  }

  @Post('decline/:orderId/:upsellOfferId')
  @ApiOperation({ summary: 'Decline upsell offer' })
  @ApiResponse({ status: 200, description: 'Upsell declined' })
  async declineUpsell(
    @Param('orderId') orderId: string,
    @Param('upsellOfferId') upsellOfferId: string,
    @Query('tenantId') tenantId: string,
  ) {
    return this.upsellsService.declineUpsell(orderId, upsellOfferId, tenantId);
  }
}
