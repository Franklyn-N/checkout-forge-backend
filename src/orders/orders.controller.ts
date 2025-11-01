import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { RefundOrderDto } from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, description: 'Order found' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async getOrder(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.ordersService.getOrder(id, user.tenantId);
  }

  @Get()
  @ApiOperation({ summary: 'List orders' })
  @ApiQuery({ name: 'customerId', required: false })
  @ApiResponse({ status: 200, description: 'Orders retrieved' })
  async listOrders(
    @CurrentUser() user: any,
    @Query('customerId') customerId?: string,
  ) {
    return this.ordersService.listOrders(user.tenantId, customerId);
  }

  @Post(':id/refund')
  @Roles('OWNER', 'ADMIN', 'FINANCE')
  @ApiOperation({ summary: 'Refund an order' })
  @ApiResponse({ status: 201, description: 'Refund processed' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async refundOrder(
    @Param('id') id: string,
    @Body() dto: RefundOrderDto,
    @CurrentUser() user: any,
  ) {
    return this.ordersService.refundOrder(
      id,
      user.tenantId,
      dto.amount,
      dto.reason,
      user.id,
    );
  }
}
