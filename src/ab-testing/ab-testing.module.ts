import { Module } from '@nestjs/common';
import { ABTestingController } from './ab-testing.controller';
import { ABTestingService } from './ab-testing.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ABTestingController],
  providers: [ABTestingService],
  exports: [ABTestingService],
})
export class ABTestingModule {}
