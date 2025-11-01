import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto, CreatePriceDto } from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('products')
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  @Roles('OWNER', 'ADMIN')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createProduct(
    @CurrentUser() user: any,
    @Body() dto: CreateProductDto,
  ) {
    return this.productsService.createProduct(user.tenantId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, description: 'Product found' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getProduct(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.productsService.getProduct(id, user.tenantId);
  }

  @Get()
  @ApiOperation({ summary: 'List all products' })
  @ApiResponse({ status: 200, description: 'Products retrieved' })
  async listProducts(@CurrentUser() user: any) {
    return this.productsService.listProducts(user.tenantId);
  }

  @Post(':id/prices')
  @Roles('OWNER', 'ADMIN')
  @ApiOperation({ summary: 'Create a price for a product' })
  @ApiResponse({ status: 201, description: 'Price created successfully' })
  async createPrice(
    @Param('id') productId: string,
    @CurrentUser() user: any,
    @Body() dto: CreatePriceDto,
  ) {
    return this.productsService.createPrice(productId, user.tenantId, dto);
  }
}
