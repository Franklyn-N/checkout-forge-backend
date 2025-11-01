import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateABTestDto, UpdateABTestDto, AssignVariantDto, RecordConversionDto } from './dto';

@Injectable()
export class ABTestingService {
  constructor(private prisma: PrismaService) {}

  async createABTest(tenantId: string, dto: CreateABTestDto) {
    if (dto.variants.length < 2) {
      throw new BadRequestException('A/B test must have at least 2 variants');
    }

    const controlCount = dto.variants.filter(v => v.isControl).length;
    if (controlCount !== 1) {
      throw new BadRequestException('A/B test must have exactly one control variant');
    }

    const abTest = await this.prisma.aBTest.create({
      data: {
        tenantId,
        name: dto.name,
        description: dto.description,
        trafficSplit: dto.trafficSplit,
        status: 'DRAFT',
        variants: {
          create: dto.variants.map(v => ({
            checkoutPageId: v.checkoutPageId,
            name: v.name,
            isControl: v.isControl || false,
          })),
        },
      },
      include: {
        variants: {
          include: {
            checkoutPage: true,
          },
        },
      },
    });

    return abTest;
  }

  async listABTests(tenantId: string, status?: string) {
    const where: any = { tenantId };
    if (status) {
      where.status = status;
    }

    return this.prisma.aBTest.findMany({
      where,
      include: {
        variants: {
          include: {
            checkoutPage: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getABTest(tenantId: string, abTestId: string) {
    const abTest = await this.prisma.aBTest.findFirst({
      where: { id: abTestId, tenantId },
      include: {
        variants: {
          include: {
            checkoutPage: true,
          },
        },
      },
    });

    if (!abTest) {
      throw new NotFoundException('A/B test not found');
    }

    return abTest;
  }

  async updateABTest(tenantId: string, abTestId: string, dto: UpdateABTestDto) {
    const abTest = await this.prisma.aBTest.findFirst({
      where: { id: abTestId, tenantId },
    });

    if (!abTest) {
      throw new NotFoundException('A/B test not found');
    }

    return this.prisma.aBTest.update({
      where: { id: abTestId },
      data: dto,
      include: {
        variants: {
          include: {
            checkoutPage: true,
          },
        },
      },
    });
  }

  async startABTest(tenantId: string, abTestId: string) {
    const abTest = await this.prisma.aBTest.findFirst({
      where: { id: abTestId, tenantId },
      include: { variants: true },
    });

    if (!abTest) {
      throw new NotFoundException('A/B test not found');
    }

    if (abTest.status !== 'DRAFT' && abTest.status !== 'PAUSED') {
      throw new BadRequestException('Can only start tests in DRAFT or PAUSED status');
    }

    return this.prisma.aBTest.update({
      where: { id: abTestId },
      data: {
        status: 'RUNNING',
        startedAt: new Date(),
      },
      include: {
        variants: true,
      },
    });
  }

  async pauseABTest(tenantId: string, abTestId: string) {
    const abTest = await this.prisma.aBTest.findFirst({
      where: { id: abTestId, tenantId },
    });

    if (!abTest) {
      throw new NotFoundException('A/B test not found');
    }

    return this.prisma.aBTest.update({
      where: { id: abTestId },
      data: { status: 'PAUSED' },
    });
  }

  async completeABTest(tenantId: string, abTestId: string, winnerVariantId?: string) {
    const abTest = await this.prisma.aBTest.findFirst({
      where: { id: abTestId, tenantId },
      include: { variants: true },
    });

    if (!abTest) {
      throw new NotFoundException('A/B test not found');
    }

    if (winnerVariantId) {
      const variant = abTest.variants.find(v => v.id === winnerVariantId);
      if (!variant) {
        throw new BadRequestException('Invalid winner variant ID');
      }
    }

    return this.prisma.aBTest.update({
      where: { id: abTestId },
      data: {
        status: 'COMPLETED',
        endedAt: new Date(),
        winnerVariantId,
      },
      include: {
        variants: true,
      },
    });
  }

  async assignVariant(tenantId: string, dto: AssignVariantDto) {
    const abTest = await this.prisma.aBTest.findFirst({
      where: { id: dto.abTestId, tenantId, status: 'RUNNING' },
      include: { variants: true },
    });

    if (!abTest) {
      throw new NotFoundException('Active A/B test not found');
    }

    const random = Math.random() * 100;
    const variantIndex = random < abTest.trafficSplit ? 0 : 1;
    const selectedVariant = abTest.variants[variantIndex];

    await this.prisma.aBTestVariant.update({
      where: { id: selectedVariant.id },
      data: { views: { increment: 1 } },
    });

    return {
      variantId: selectedVariant.id,
      checkoutPageId: selectedVariant.checkoutPageId,
      isControl: selectedVariant.isControl,
    };
  }

  async recordConversion(tenantId: string, dto: RecordConversionDto) {
    const variant = await this.prisma.aBTestVariant.findFirst({
      where: {
        id: dto.variantId,
        abTest: { id: dto.abTestId, tenantId },
      },
    });

    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    await Promise.all([
      this.prisma.aBTestVariant.update({
        where: { id: dto.variantId },
        data: {
          conversions: { increment: 1 },
          revenue: { increment: dto.revenue },
        },
      }),
      this.prisma.aBTestAssignment.create({
        data: {
          abTestId: dto.abTestId,
          variantId: dto.variantId,
          orderId: dto.orderId,
          sessionId: dto.sessionId,
        },
      }),
    ]);

    return { message: 'Conversion recorded successfully' };
  }

  async getABTestResults(tenantId: string, abTestId: string) {
    const abTest = await this.prisma.aBTest.findFirst({
      where: { id: abTestId, tenantId },
      include: {
        variants: {
          include: {
            checkoutPage: true,
          },
        },
      },
    });

    if (!abTest) {
      throw new NotFoundException('A/B test not found');
    }

    const results = abTest.variants.map(variant => {
      const conversionRate = variant.views > 0 ? (variant.conversions / variant.views) * 100 : 0;
      const aov = variant.conversions > 0 ? variant.revenue / variant.conversions : 0;

      return {
        variantId: variant.id,
        name: variant.name,
        isControl: variant.isControl,
        checkoutPageId: variant.checkoutPageId,
        checkoutPageName: variant.checkoutPage.name,
        views: variant.views,
        conversions: variant.conversions,
        conversionRate: Math.round(conversionRate * 100) / 100,
        revenue: variant.revenue,
        aov: Math.round(aov),
      };
    });

    return {
      abTest: {
        id: abTest.id,
        name: abTest.name,
        description: abTest.description,
        status: abTest.status,
        trafficSplit: abTest.trafficSplit,
        startedAt: abTest.startedAt,
        endedAt: abTest.endedAt,
        winnerVariantId: abTest.winnerVariantId,
      },
      results,
    };
  }
}
