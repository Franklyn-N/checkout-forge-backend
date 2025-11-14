"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const jwt_1 = require("@nestjs/jwt");
const auth_service_1 = require("./auth.service");
const prisma_service_1 = require("../prisma/prisma.service");
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
jest.mock('bcrypt');
describe('AuthService', () => {
    let service;
    let prisma;
    let jwtService;
    const mockPrismaService = {
        userAccount: {
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
    };
    const mockJwtService = {
        sign: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                { provide: prisma_service_1.PrismaService, useValue: mockPrismaService },
                { provide: jwt_1.JwtService, useValue: mockJwtService },
            ],
        }).compile();
        service = module.get(auth_service_1.AuthService);
        prisma = module.get(prisma_service_1.PrismaService);
        jwtService = module.get(jwt_1.JwtService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('signup', () => {
        it('should create a new user and return token', async () => {
            const signupDto = {
                email: 'test@example.com',
                password: 'password123',
                tenantId: 'tenant-1',
                firstName: 'Test',
                lastName: 'User',
            };
            const hashedPassword = 'hashed_password';
            const mockUser = {
                id: 'user-1',
                email: signupDto.email,
                firstName: signupDto.firstName,
                lastName: signupDto.lastName,
                role: 'ADMIN',
                tenantId: signupDto.tenantId,
                createdAt: new Date(),
            };
            mockPrismaService.userAccount.findUnique.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue(hashedPassword);
            mockPrismaService.userAccount.create.mockResolvedValue(mockUser);
            mockJwtService.sign.mockReturnValue('jwt_token');
            const result = await service.signup(signupDto);
            expect(result).toHaveProperty('user');
            expect(result).toHaveProperty('token');
            expect(result.token).toBe('jwt_token');
            expect(mockPrismaService.userAccount.create).toHaveBeenCalled();
        });
        it('should throw ConflictException if user exists', async () => {
            const signupDto = {
                email: 'existing@example.com',
                password: 'password123',
                tenantId: 'tenant-1',
            };
            mockPrismaService.userAccount.findUnique.mockResolvedValue({ id: 'existing-user' });
            await expect(service.signup(signupDto)).rejects.toThrow(common_1.ConflictException);
        });
    });
    describe('login', () => {
        it('should login user with valid credentials', async () => {
            const loginDto = {
                email: 'test@example.com',
                password: 'password123',
                tenantId: 'tenant-1',
            };
            const mockUser = {
                id: 'user-1',
                email: loginDto.email,
                passwordHash: 'hashed_password',
                firstName: 'Test',
                lastName: 'User',
                role: 'ADMIN',
                tenantId: loginDto.tenantId,
                isActive: true,
            };
            mockPrismaService.userAccount.findUnique.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            mockPrismaService.userAccount.update.mockResolvedValue(mockUser);
            mockJwtService.sign.mockReturnValue('jwt_token');
            const result = await service.login(loginDto);
            expect(result).toHaveProperty('user');
            expect(result).toHaveProperty('token');
            expect(result.token).toBe('jwt_token');
        });
        it('should throw UnauthorizedException for invalid credentials', async () => {
            const loginDto = {
                email: 'test@example.com',
                password: 'wrong_password',
                tenantId: 'tenant-1',
            };
            mockPrismaService.userAccount.findUnique.mockResolvedValue(null);
            await expect(service.login(loginDto)).rejects.toThrow(common_1.UnauthorizedException);
        });
    });
});
//# sourceMappingURL=auth.service.spec.js.map