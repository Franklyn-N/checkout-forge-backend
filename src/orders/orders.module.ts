import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CheckoutsModule } from '../checkouts/checkouts.module';

@Module({
  imports: [CheckoutsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
