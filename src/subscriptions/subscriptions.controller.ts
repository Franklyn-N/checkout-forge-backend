import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('subscriptions')
@Controller('subscriptions')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @Get()
  @ApiOperation({ summary: 'List subscriptions' })
  @ApiQuery({ name: 'customerId', required: false })
  @ApiResponse({ status: 200, description: 'Subscriptions retrieved' })
  async listSubscriptions(
    @CurrentUser() user: any,
    @Query('customerId') customerId?: string,
  ) {
    return this.subscriptionsService.listSubscriptions(user.tenantId, customerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get subscription by ID' })
  @ApiResponse({ status: 200, description: 'Subscription found' })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  async getSubscription(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.subscriptionsService.getSubscription(id, user.tenantId);
  }

  @Post(':id/cancel')
  @Roles('OWNER', 'ADMIN', 'FINANCE')
  @ApiOperation({ summary: 'Cancel a subscription' })
  @ApiResponse({ status: 200, description: 'Subscription canceled' })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  async cancelSubscription(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.subscriptionsService.cancelSubscription(id, user.tenantId);
  }
}
