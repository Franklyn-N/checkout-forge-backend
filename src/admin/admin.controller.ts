import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminService } from './admin.service';
import { CreateProductDto, UpdateProductDto, CreatePriceDto, UpdatePriceDto, ProcessRefundDto } from './dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('products')
  @Roles('OWNER', 'ADMIN')
  async createProduct(@Req() req, @Body() dto: CreateProductDto) {
    return this.adminService.createProduct(req.user.tenantId, dto);
  }

  @Get('products')
  @Roles('OWNER', 'ADMIN', 'FINANCE', 'SUPPORT')
  async listProducts(
    @Req() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.listProducts(
      req.user.tenantId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Get('products/:id')
  @Roles('OWNER', 'ADMIN', 'FINANCE', 'SUPPORT')
  async getProduct(@Req() req, @Param('id') id: string) {
    return this.adminService.getProduct(req.user.tenantId, id);
  }

  @Put('products/:id')
  @Roles('OWNER', 'ADMIN')
  async updateProduct(@Req() req, @Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.adminService.updateProduct(req.user.tenantId, id, dto);
  }

  @Delete('products/:id')
  @Roles('OWNER', 'ADMIN')
  async deleteProduct(@Req() req, @Param('id') id: string) {
    return this.adminService.deleteProduct(req.user.tenantId, id);
  }

  @Post('prices')
  @Roles('OWNER', 'ADMIN')
  async createPrice(@Req() req, @Body() dto: CreatePriceDto) {
    return this.adminService.createPrice(req.user.tenantId, dto);
  }

  @Put('prices/:id')
  @Roles('OWNER', 'ADMIN')
  async updatePrice(@Req() req, @Param('id') id: string, @Body() dto: UpdatePriceDto) {
    return this.adminService.updatePrice(req.user.tenantId, id, dto);
  }

  @Delete('prices/:id')
  @Roles('OWNER', 'ADMIN')
  async deletePrice(@Req() req, @Param('id') id: string) {
    return this.adminService.deletePrice(req.user.tenantId, id);
  }

  @Get('orders')
  @Roles('OWNER', 'ADMIN', 'FINANCE', 'SUPPORT')
  async listOrders(
    @Req() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.listOrders(
      req.user.tenantId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
      status,
    );
  }

  @Get('orders/:id')
  @Roles('OWNER', 'ADMIN', 'FINANCE', 'SUPPORT')
  async getOrder(@Req() req, @Param('id') id: string) {
    return this.adminService.getOrder(req.user.tenantId, id);
  }

  @Post('refunds')
  @Roles('OWNER', 'ADMIN', 'FINANCE')
  async processRefund(@Req() req, @Body() dto: ProcessRefundDto) {
    return this.adminService.processRefund(req.user.tenantId, dto, req.user.userId);
  }

  @Get('subscriptions')
  @Roles('OWNER', 'ADMIN', 'FINANCE', 'SUPPORT')
  async listSubscriptions(
    @Req() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.listSubscriptions(
      req.user.tenantId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
      status,
    );
  }

  @Post('subscriptions/:id/cancel')
  @Roles('OWNER', 'ADMIN', 'FINANCE')
  async cancelSubscription(@Req() req, @Param('id') id: string) {
    return this.adminService.cancelSubscription(req.user.tenantId, id);
  }

  @Get('dunning/dashboard')
  @Roles('OWNER', 'ADMIN', 'FINANCE')
  async getDunningDashboard(@Req() req) {
    return this.adminService.getDunningDashboard(req.user.tenantId);
  }
}
