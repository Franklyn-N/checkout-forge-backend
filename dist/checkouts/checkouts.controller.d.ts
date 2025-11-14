import { CheckoutsService } from './checkouts.service';
import { CreateCheckoutSessionDto } from './dto';
export declare class CheckoutsController {
    private checkoutsService;
    constructor(checkoutsService: CheckoutsService);
    getCheckout(slug: string, user: any): Promise<any>;
    createSession(checkoutId: string, dto: CreateCheckoutSessionDto, user: any): Promise<{
        clientSecret: string;
        orderId: any;
        orderNumber: any;
        total: number;
        currency: any;
    }>;
}
