import { Module } from '@nestjs/common';
import { CheckoutsController } from './checkouts.controller';
import { CheckoutsService } from './checkouts.service';
import { StripeService } from './stripe.service';

@Module({
  controllers: [CheckoutsController],
  providers: [CheckoutsService, StripeService],
  exports: [CheckoutsService, StripeService],
})
export class CheckoutsModule {}
