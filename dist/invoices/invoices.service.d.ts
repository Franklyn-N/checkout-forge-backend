import { PrismaService } from '../prisma/prisma.service';
import { GenerateInvoiceDto } from './dto';
export declare class InvoicesService {
    private prisma;
    constructor(prisma: PrismaService);
    generateInvoice(tenantId: string, dto: GenerateInvoiceDto): Promise<any>;
    private generateInvoiceNumber;
    getInvoice(tenantId: string, invoiceId: string): Promise<any>;
    listInvoices(tenantId: string, page?: number, limit?: number): Promise<{
        data: any;
        meta: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    generatePDF(tenantId: string, invoiceId: string): Promise<string>;
    private generateInvoiceHTML;
}
