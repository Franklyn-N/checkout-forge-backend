import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, CreatePriceDto, UpdatePriceDto, ProcessRefundDto } from './dto';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    createProduct(tenantId: string, dto: CreateProductDto): Promise<any>;
    updateProduct(tenantId: string, productId: string, dto: UpdateProductDto): Promise<any>;
    deleteProduct(tenantId: string, productId: string): Promise<{
        message: string;
    }>;
    getProduct(tenantId: string, productId: string): Promise<any>;
    listProducts(tenantId: string, page?: number, limit?: number): Promise<{
        data: any;
        meta: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    createPrice(tenantId: string, dto: CreatePriceDto): Promise<any>;
    updatePrice(tenantId: string, priceId: string, dto: UpdatePriceDto): Promise<any>;
    deletePrice(tenantId: string, priceId: string): Promise<{
        message: string;
    }>;
    listOrders(tenantId: string, page?: number, limit?: number, status?: string): Promise<{
        data: any;
        meta: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    getOrder(tenantId: string, orderId: string): Promise<any>;
    processRefund(tenantId: string, dto: ProcessRefundDto, userId: string): Promise<any>;
    listSubscriptions(tenantId: string, page?: number, limit?: number, status?: string): Promise<{
        data: any;
        meta: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    cancelSubscription(tenantId: string, subscriptionId: string): Promise<any>;
    getDunningDashboard(tenantId: string): Promise<{
        stats: {
            totalPastDue: any;
            totalRevenue: any;
        };
        subscriptions: any;
    }>;
}
