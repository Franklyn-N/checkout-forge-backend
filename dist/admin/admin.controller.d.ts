import { AdminService } from './admin.service';
import { CreateProductDto, UpdateProductDto, CreatePriceDto, UpdatePriceDto, ProcessRefundDto } from './dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    createProduct(req: any, dto: CreateProductDto): Promise<any>;
    listProducts(req: any, page?: string, limit?: string): Promise<{
        data: any;
        meta: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    getProduct(req: any, id: string): Promise<any>;
    updateProduct(req: any, id: string, dto: UpdateProductDto): Promise<any>;
    deleteProduct(req: any, id: string): Promise<{
        message: string;
    }>;
    createPrice(req: any, dto: CreatePriceDto): Promise<any>;
    updatePrice(req: any, id: string, dto: UpdatePriceDto): Promise<any>;
    deletePrice(req: any, id: string): Promise<{
        message: string;
    }>;
    listOrders(req: any, page?: string, limit?: string, status?: string): Promise<{
        data: any;
        meta: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    getOrder(req: any, id: string): Promise<any>;
    processRefund(req: any, dto: ProcessRefundDto): Promise<any>;
    listSubscriptions(req: any, page?: string, limit?: string, status?: string): Promise<{
        data: any;
        meta: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    cancelSubscription(req: any, id: string): Promise<any>;
    getDunningDashboard(req: any): Promise<{
        stats: {
            totalPastDue: any;
            totalRevenue: any;
        };
        subscriptions: any;
    }>;
}
