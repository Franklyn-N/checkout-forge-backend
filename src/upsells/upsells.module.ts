import { Module } from '@nestjs/common';
import { UpsellsController } from './upsells.controller';
import { UpsellsService } from './upsells.service';
import { CheckoutsModule } from '../checkouts/checkouts.module';

@Module({
  imports: [CheckoutsModule],
  controllers: [UpsellsController],
  providers: [UpsellsService],
  exports: [UpsellsService],
})
export class UpsellsModule {}
