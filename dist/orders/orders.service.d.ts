import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from '../checkouts/stripe.service';
export declare class OrdersService {
    private prisma;
    private stripeService;
    constructor(prisma: PrismaService, stripeService: StripeService);
    getOrder(id: string, tenantId: string): Promise<any>;
    listOrders(tenantId: string, customerId?: string): Promise<any>;
    refundOrder(id: string, tenantId: string, amount?: number, reason?: string, processedBy?: string): Promise<any>;
}
