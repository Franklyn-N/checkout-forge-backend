import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  Body,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { TemplatesManagerService } from './templates-manager.service';
import { UploadTemplateDto, QueryTemplatesDto, PublishTemplateDto } from './dto';

@ApiTags('templates-manager')
@Controller('templates-manager')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TemplatesManagerController {
  constructor(private readonly templatesService: TemplatesManagerService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload a new template' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'html', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
    ]),
  )
  async uploadTemplate(
    @CurrentUser() user: any,
    @Body() dto: UploadTemplateDto,
    @UploadedFiles()
    files: {
      html?: Express.Multer.File[];
      thumbnail?: Express.Multer.File[];
    },
  ) {
    if (!files.html || files.html.length === 0) {
      throw new Error('HTML file is required');
    }

    return this.templatesService.uploadTemplate(
      user.tenantId,
      user.id,
      dto,
      files.html[0],
      files.thumbnail?.[0],
    );
  }

  @Get()
  @ApiOperation({ summary: 'List all templates' })
  async listTemplates(@CurrentUser() user: any, @Query() query: QueryTemplatesDto) {
    return this.templatesService.listTemplates(user.tenantId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get template by ID' })
  async getTemplate(@CurrentUser() user: any, @Param('id') id: string) {
    return this.templatesService.getTemplate(user.tenantId, id);
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish a template version' })
  async publishTemplate(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: PublishTemplateDto,
  ) {
    return this.templatesService.publishTemplate(user.tenantId, user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a template' })
  async deleteTemplate(@CurrentUser() user: any, @Param('id') id: string) {
    return this.templatesService.deleteTemplate(user.tenantId, user.id, id);
  }
}
