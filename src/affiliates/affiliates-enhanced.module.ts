import { Module } from '@nestjs/common';
import { AffiliatesEnhancedController } from './affiliates-enhanced.controller';
import { AffiliatesEnhancedService } from './affiliates-enhanced.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AffiliatesEnhancedController],
  providers: [AffiliatesEnhancedService],
  exports: [AffiliatesEnhancedService],
})
export class AffiliatesEnhancedModule {}
