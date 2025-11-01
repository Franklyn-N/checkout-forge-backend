import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from './stripe.service';
import { CreateCheckoutSessionDto } from './dto';
export declare class CheckoutsService {
    private prisma;
    private stripeService;
    constructor(prisma: PrismaService, stripeService: StripeService);
    getCheckoutPage(slug: string, tenantId: string): Promise<{
        orderBumps: {
            description: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            priceId: string;
            checkoutPageId: string;
            label: string;
        }[];
        upsellOffers: {
            description: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            priceId: string;
            checkoutPageId: string;
            displayOrder: number;
            headline: string;
        }[];
    } & {
        name: string;
        description: string | null;
        tenantId: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        mainPriceId: string | null;
        collectVat: boolean;
        vatPercentage: import("@prisma/client/runtime/library").Decimal | null;
        allowCoupons: boolean;
        successUrl: string | null;
        cancelUrl: string | null;
        customFields: import("@prisma/client/runtime/library").JsonValue | null;
        settings: import("@prisma/client/runtime/library").JsonValue | null;
        templateId: string | null;
        blocks: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    createCheckoutSession(checkoutId: string, dto: CreateCheckoutSessionDto, tenantId: string): Promise<{
        clientSecret: string;
        orderId: string;
        orderNumber: string;
        total: number;
        currency: string;
    }>;
}
