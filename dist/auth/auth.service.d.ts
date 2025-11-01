import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto, LoginDto } from './dto';
export declare class AuthService {
    private prisma;
    private jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
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
    validateUser(email: string, password: string, tenantId: string): Promise<{
        email: string;
        firstName: string | null;
        lastName: string | null;
        tenantId: string;
        role: import(".prisma/client").$Enums.UserRole;
        id: string;
        passwordHash: string;
        isActive: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private generateToken;
}
