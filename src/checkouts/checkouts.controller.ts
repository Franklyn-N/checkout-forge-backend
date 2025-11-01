import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CheckoutsService } from './checkouts.service';
import { CreateCheckoutSessionDto } from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('checkouts')
@Controller('checkouts')
export class CheckoutsController {
  constructor(private checkoutsService: CheckoutsService) {}

  @Get(':slug')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get checkout page by slug' })
  @ApiResponse({ status: 200, description: 'Checkout page found' })
  @ApiResponse({ status: 404, description: 'Checkout page not found' })
  async getCheckout(
    @Param('slug') slug: string,
    @CurrentUser() user: any,
  ) {
    return this.checkoutsService.getCheckoutPage(slug, user.tenantId);
  }

  @Post(':checkoutId/session')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Stripe checkout session' })
  @ApiResponse({ status: 201, description: 'Session created with clientSecret' })
  @ApiResponse({ status: 404, description: 'Checkout page not found' })
  async createSession(
    @Param('checkoutId') checkoutId: string,
    @Body() dto: CreateCheckoutSessionDto,
    @CurrentUser() user: any,
  ) {
    return this.checkoutsService.createCheckoutSession(
      checkoutId,
      dto,
      user.tenantId,
    );
  }
}
