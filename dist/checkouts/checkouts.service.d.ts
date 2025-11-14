import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from './stripe.service';
import { CreateCheckoutSessionDto } from './dto';
export declare class CheckoutsService {
    private prisma;
    private stripeService;
    constructor(prisma: PrismaService, stripeService: StripeService);
    getCheckoutPage(slug: string, tenantId: string): Promise<any>;
    createCheckoutSession(checkoutId: string, dto: CreateCheckoutSessionDto, tenantId: string): Promise<{
        clientSecret: string;
        orderId: any;
        orderNumber: any;
        total: number;
        currency: any;
    }>;
}
