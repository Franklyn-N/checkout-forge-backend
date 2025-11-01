import { ProductsService } from './products.service';
import { CreateProductDto, CreatePriceDto } from './dto';
export declare class ProductsController {
    private productsService;
    constructor(productsService: ProductsService);
    createProduct(user: any, dto: CreateProductDto): Promise<{
        prices: {
            type: import(".prisma/client").$Enums.PriceType;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            amount: number;
            currency: string;
            interval: import(".prisma/client").$Enums.BillingInterval | null;
            intervalCount: number | null;
            trialDays: number | null;
            stripePriceId: string | null;
            productId: string;
        }[];
    } & {
        name: string;
        description: string | null;
        tenantId: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    getProduct(id: string, user: any): Promise<{
        prices: {
            type: import(".prisma/client").$Enums.PriceType;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            amount: number;
            currency: string;
            interval: import(".prisma/client").$Enums.BillingInterval | null;
            intervalCount: number | null;
            trialDays: number | null;
            stripePriceId: string | null;
            productId: string;
        }[];
    } & {
        name: string;
        description: string | null;
        tenantId: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    listProducts(user: any): Promise<({
        prices: {
            type: import(".prisma/client").$Enums.PriceType;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            amount: number;
            currency: string;
            interval: import(".prisma/client").$Enums.BillingInterval | null;
            intervalCount: number | null;
            trialDays: number | null;
            stripePriceId: string | null;
            productId: string;
        }[];
    } & {
        name: string;
        description: string | null;
        tenantId: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    createPrice(productId: string, user: any, dto: CreatePriceDto): Promise<{
        type: import(".prisma/client").$Enums.PriceType;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        amount: number;
        currency: string;
        interval: import(".prisma/client").$Enums.BillingInterval | null;
        intervalCount: number | null;
        trialDays: number | null;
        stripePriceId: string | null;
        productId: string;
    }>;
}
