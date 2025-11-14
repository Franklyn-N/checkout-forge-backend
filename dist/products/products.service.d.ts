import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, CreatePriceDto } from './dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    createProduct(tenantId: string, dto: CreateProductDto): Promise<any>;
    getProduct(id: string, tenantId: string): Promise<any>;
    listProducts(tenantId: string): Promise<any>;
    createPrice(productId: string, tenantId: string, dto: CreatePriceDto): Promise<any>;
}
