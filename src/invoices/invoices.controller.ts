import { Controller, Get, Post, Body, Param, Query, UseGuards, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { InvoicesService } from './invoices.service';
import { GenerateInvoiceDto } from './dto';

@Controller('invoices')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post('generate')
  @Roles('OWNER', 'ADMIN', 'FINANCE')
  async generateInvoice(@Req() req, @Body() dto: GenerateInvoiceDto) {
    return this.invoicesService.generateInvoice(req.user.tenantId, dto);
  }

  @Get()
  @Roles('OWNER', 'ADMIN', 'FINANCE', 'SUPPORT')
  async listInvoices(
    @Req() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.invoicesService.listInvoices(
      req.user.tenantId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Get(':id')
  @Roles('OWNER', 'ADMIN', 'FINANCE', 'SUPPORT')
  async getInvoice(@Req() req, @Param('id') id: string) {
    return this.invoicesService.getInvoice(req.user.tenantId, id);
  }

  @Get(':id/pdf')
  @Roles('OWNER', 'ADMIN', 'FINANCE', 'SUPPORT')
  async generatePDF(@Req() req, @Param('id') id: string, @Res() res: Response) {
    const html = await this.invoicesService.generatePDF(req.user.tenantId, id);

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }
}
