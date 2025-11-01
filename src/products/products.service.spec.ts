import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    product: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
    price: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    it('should create a product', async () => {
      const createProductDto = {
        name: 'Test Product',
        description: 'Test Description',
      };

      const mockProduct = {
        id: 'product-1',
        ...createProductDto,
        tenantId: 'tenant-1',
        prices: [],
      };

      mockPrismaService.product.create.mockResolvedValue(mockProduct);

      const result = await service.createProduct('tenant-1', createProductDto);

      expect(result).toEqual(mockProduct);
      expect(mockPrismaService.product.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          tenantId: 'tenant-1',
          name: createProductDto.name,
          description: createProductDto.description,
        }),
        include: { prices: true },
      });
    });
  });

  describe('getProduct', () => {
    it('should return a product', async () => {
      const mockProduct = {
        id: 'product-1',
        name: 'Test Product',
        tenantId: 'tenant-1',
        prices: [],
      };

      mockPrismaService.product.findFirst.mockResolvedValue(mockProduct);

      const result = await service.getProduct('product-1', 'tenant-1');

      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException if product not found', async () => {
      mockPrismaService.product.findFirst.mockResolvedValue(null);

      await expect(service.getProduct('invalid-id', 'tenant-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
