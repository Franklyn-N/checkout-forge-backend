import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto, UpdateTemplateDto, AssignTemplateDto, UpdateCheckoutBlocksDto } from './dto';

@Controller('templates')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Post()
  @Roles('OWNER', 'ADMIN')
  async createTemplate(@Req() req, @Body() dto: CreateTemplateDto) {
    return this.templatesService.createTemplate(req.user.tenantId, dto);
  }

  @Get()
  @Roles('OWNER', 'ADMIN', 'FINANCE', 'SUPPORT')
  async listTemplates(@Req() req, @Query('includePublic') includePublic?: string) {
    return this.templatesService.listTemplates(
      req.user.tenantId,
      includePublic === 'true',
    );
  }

  @Get(':id')
  @Roles('OWNER', 'ADMIN', 'FINANCE', 'SUPPORT')
  async getTemplate(@Req() req, @Param('id') id: string) {
    return this.templatesService.getTemplate(req.user.tenantId, id);
  }

  @Put(':id')
  @Roles('OWNER', 'ADMIN')
  async updateTemplate(@Req() req, @Param('id') id: string, @Body() dto: UpdateTemplateDto) {
    return this.templatesService.updateTemplate(req.user.tenantId, id, dto);
  }

  @Delete(':id')
  @Roles('OWNER', 'ADMIN')
  async deleteTemplate(@Req() req, @Param('id') id: string) {
    return this.templatesService.deleteTemplate(req.user.tenantId, id);
  }

  @Post('assign')
  @Roles('OWNER', 'ADMIN')
  async assignTemplate(@Req() req, @Body() dto: AssignTemplateDto) {
    return this.templatesService.assignTemplate(req.user.tenantId, dto);
  }

  @Put('checkout-blocks')
  @Roles('OWNER', 'ADMIN')
  async updateCheckoutBlocks(@Req() req, @Body() dto: UpdateCheckoutBlocksDto) {
    return this.templatesService.updateCheckoutBlocks(req.user.tenantId, dto);
  }

  @Get('checkout-blocks/:checkoutPageId')
  @Roles('OWNER', 'ADMIN', 'FINANCE', 'SUPPORT')
  async getCheckoutBlocks(@Req() req, @Param('checkoutPageId') checkoutPageId: string) {
    return this.templatesService.getCheckoutBlocks(req.user.tenantId, checkoutPageId);
  }
}
