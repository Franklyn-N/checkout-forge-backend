import { OrdersService } from './orders.service';
import { RefundOrderDto } from './dto';
export declare class OrdersController {
    private ordersService;
    constructor(ordersService: OrdersService);
    getOrder(id: string, user: any): Promise<any>;
    listOrders(user: any, customerId?: string): Promise<any>;
    refundOrder(id: string, dto: RefundOrderDto, user: any): Promise<any>;
}
