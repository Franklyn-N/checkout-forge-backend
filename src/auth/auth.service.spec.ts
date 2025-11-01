import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

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
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
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
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
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

      await expect(service.signup(signupDto)).rejects.toThrow(ConflictException);
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
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
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

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
