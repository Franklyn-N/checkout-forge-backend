import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, CreatePriceDto } from './dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async createProduct(tenantId: string, dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        tenantId,
        name: dto.name,
        description: dto.description,
        imageUrl: dto.imageUrl,
        metadata: dto.metadata,
      },
      include: {
        prices: true,
      },
    });
  }

  async getProduct(id: string, tenantId: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, tenantId },
      include: {
        prices: {
          where: { isActive: true },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async listProducts(tenantId: string) {
    return this.prisma.product.findMany({
      where: { tenantId, isActive: true },
      include: {
        prices: {
          where: { isActive: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createPrice(productId: string, tenantId: string, dto: CreatePriceDto) {
    const product = await this.prisma.product.findFirst({
      where: { id: productId, tenantId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.price.create({
      data: {
        productId,
        amount: dto.amount,
        currency: dto.currency || 'GBP',
        type: dto.type || 'ONE_TIME',
        interval: dto.interval,
        intervalCount: dto.intervalCount,
        trialDays: dto.trialDays,
        stripePriceId: dto.stripePriceId,
        metadata: dto.metadata,
      },
    });
  }
}
