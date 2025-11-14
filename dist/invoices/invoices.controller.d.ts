import { Response } from 'express';
import { InvoicesService } from './invoices.service';
import { GenerateInvoiceDto } from './dto';
export declare class InvoicesController {
    private readonly invoicesService;
    constructor(invoicesService: InvoicesService);
    generateInvoice(req: any, dto: GenerateInvoiceDto): Promise<any>;
    listInvoices(req: any, page?: string, limit?: string): Promise<{
        data: any;
        meta: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    getInvoice(req: any, id: string): Promise<any>;
    generatePDF(req: any, id: string, res: Response): Promise<void>;
}
