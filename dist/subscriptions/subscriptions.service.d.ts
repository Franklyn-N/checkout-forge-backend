import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from '../checkouts/stripe.service';
export declare class SubscriptionsService {
    private prisma;
    private stripeService;
    constructor(prisma: PrismaService, stripeService: StripeService);
    listSubscriptions(tenantId: string, customerId?: string): Promise<any>;
    getSubscription(id: string, tenantId: string): Promise<any>;
    cancelSubscription(id: string, tenantId: string): Promise<any>;
}
