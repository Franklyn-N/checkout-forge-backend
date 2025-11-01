import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TemplatesManagerController } from './templates-manager.controller';
import { TemplatesManagerService } from './templates-manager.service';
import { S3UploadService } from './s3-upload.service';
import { TemplateValidatorService } from './template-validator.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [TemplatesManagerController],
  providers: [TemplatesManagerService, S3UploadService, TemplateValidatorService],
  exports: [TemplatesManagerService],
})
export class TemplatesManagerModule {}
