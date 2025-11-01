import { AuthService } from './auth.service';
import { SignupDto, LoginDto } from './dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signup(dto: SignupDto): Promise<{
        user: {
            email: string;
            firstName: string;
            lastName: string;
            tenantId: string;
            role: import(".prisma/client").$Enums.UserRole;
            id: string;
            createdAt: Date;
        };
        token: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.UserRole;
            tenantId: string;
        };
        token: string;
    }>;
}
