import { ConfigService } from '@nestjs/config';
export declare class S3UploadService {
    private configService;
    private s3Client;
    private bucketName;
    constructor(configService: ConfigService);
    uploadFile(file: Express.Multer.File, tenantId: string, folder: string): Promise<string>;
    deleteFile(fileUrl: string): Promise<void>;
}
