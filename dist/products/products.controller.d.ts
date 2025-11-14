import { ProductsService } from './products.service';
import { CreateProductDto, CreatePriceDto } from './dto';
export declare class ProductsController {
    private productsService;
    constructor(productsService: ProductsService);
    createProduct(user: any, dto: CreateProductDto): Promise<any>;
    getProduct(id: string, user: any): Promise<any>;
    listProducts(user: any): Promise<any>;
    createPrice(productId: string, user: any, dto: CreatePriceDto): Promise<any>;
}
