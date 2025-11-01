import { Controller, Get, Post, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { GdprService } from './gdpr.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('gdpr')
@Controller('gdpr')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class GdprController {
  constructor(private gdprService: GdprService) {}

  @Get('export')
  @Roles('OWNER', 'ADMIN')
  @ApiOperation({ summary: 'Export customer data (GDPR compliance)' })
  @ApiQuery({ name: 'customer_id', required: true })
  @ApiResponse({ status: 200, description: 'Customer data exported' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async exportCustomerData(
    @CurrentUser() user: any,
    @Query('customer_id') customerId: string,
  ) {
    if (!customerId) {
      throw new BadRequestException('customer_id query parameter is required');
    }

    return this.gdprService.exportCustomerData(customerId, user.tenantId);
  }

  @Post('delete')
  @Roles('OWNER', 'ADMIN')
  @ApiOperation({ summary: 'Delete/anonymize customer data (GDPR compliance)' })
  @ApiQuery({ name: 'customer_id', required: true })
  @ApiResponse({ status: 200, description: 'Customer data deleted/anonymized' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async deleteCustomerData(
    @CurrentUser() user: any,
    @Query('customer_id') customerId: string,
  ) {
    if (!customerId) {
      throw new BadRequestException('customer_id query parameter is required');
    }

    return this.gdprService.deleteCustomerData(customerId, user.tenantId);
  }
}
