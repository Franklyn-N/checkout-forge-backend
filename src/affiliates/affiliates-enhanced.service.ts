import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  RegisterAffiliateDto,
  UpdateAffiliateDto,
  TrackClickDto,
  RecordConversionDto,
  ApproveCommissionDto,
  MarkCommissionPaidDto,
} from './dto';

@Injectable()
export class AffiliatesEnhancedService {
  constructor(private prisma: PrismaService) {}

  async registerAffiliate(tenantId: string, dto: RegisterAffiliateDto) {
    const existing = await this.prisma.affiliate.findFirst({
      where: {
        tenantId,
        code: dto.code,
      },
    });

    if (existing) {
      throw new ConflictException('Affiliate code already exists');
    }

    return this.prisma.affiliate.create({
      data: {
        tenantId,
        code: dto.code,
        name: dto.name,
        email: dto.email,
        status: 'PENDING',
      },
    });
  }

  async listAffiliates(tenantId: string, status?: string) {
    const where: any = { tenantId };
    if (status) {
      where.status = status;
    }

    return this.prisma.affiliate.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAffiliate(tenantId: string, affiliateId: string) {
    const affiliate = await this.prisma.affiliate.findFirst({
      where: { id: affiliateId, tenantId },
      include: {
        commissions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!affiliate) {
      throw new NotFoundException('Affiliate not found');
    }

    return affiliate;
  }

  async updateAffiliate(tenantId: string, affiliateId: string, dto: UpdateAffiliateDto) {
    const affiliate = await this.prisma.affiliate.findFirst({
      where: { id: affiliateId, tenantId },
    });

    if (!affiliate) {
      throw new NotFoundException('Affiliate not found');
    }

    return this.prisma.affiliate.update({
      where: { id: affiliateId },
      data: dto,
    });
  }

  async approveAffiliate(tenantId: string, affiliateId: string, userId: string) {
    const affiliate = await this.prisma.affiliate.findFirst({
      where: { id: affiliateId, tenantId },
    });

    if (!affiliate) {
      throw new NotFoundException('Affiliate not found');
    }

    if (affiliate.status !== 'PENDING') {
      throw new BadRequestException('Affiliate is not in pending status');
    }

    return this.prisma.affiliate.update({
      where: { id: affiliateId },
      data: {
        status: 'APPROVED',
        approvedBy: userId,
        approvedAt: new Date(),
        isActive: true,
      },
    });
  }

  async rejectAffiliate(tenantId: string, affiliateId: string) {
    const affiliate = await this.prisma.affiliate.findFirst({
      where: { id: affiliateId, tenantId },
    });

    if (!affiliate) {
      throw new NotFoundException('Affiliate not found');
    }

    return this.prisma.affiliate.update({
      where: { id: affiliateId },
      data: {
        status: 'REJECTED',
        isActive: false,
      },
    });
  }

  async trackClick(tenantId: string, dto: TrackClickDto) {
    const affiliate = await this.prisma.affiliate.findFirst({
      where: {
        tenantId,
        code: dto.affiliateCode,
        status: 'APPROVED',
        isActive: true,
      },
    });

    if (!affiliate) {
      throw new NotFoundException('Affiliate not found or not active');
    }

    const click = await this.prisma.affiliateClick.create({
      data: {
        affiliateId: affiliate.id,
        tenantId,
        ip: dto.ip,
        userAgent: dto.userAgent,
        referrer: dto.referrer,
        landingPage: dto.landingPage,
      },
    });

    await this.prisma.affiliate.update({
      where: { id: affiliate.id },
      data: {
        totalClicks: { increment: 1 },
      },
    });

    return {
      clickId: click.id,
      affiliateId: affiliate.id,
    };
  }

  async recordConversion(tenantId: string, dto: RecordConversionDto) {
    const affiliate = await this.prisma.affiliate.findFirst({
      where: { id: dto.affiliateId, tenantId },
    });

    if (!affiliate) {
      throw new NotFoundException('Affiliate not found');
    }

    const commissionAmount = Math.round((dto.orderTotal * Number(affiliate.commissionRate)) / 100);

    const [commission] = await Promise.all([
      this.prisma.affiliateCommission.create({
        data: {
          affiliateId: dto.affiliateId,
          orderId: dto.orderId,
          amount: commissionAmount,
          status: 'PENDING',
        },
      }),
      this.prisma.affiliate.update({
        where: { id: dto.affiliateId },
        data: {
          totalConversions: { increment: 1 },
          totalSales: { increment: dto.orderTotal },
          totalCommission: { increment: commissionAmount },
        },
      }),
      this.prisma.affiliateClick.updateMany({
        where: {
          affiliateId: dto.affiliateId,
          converted: false,
        },
        data: {
          converted: true,
          orderId: dto.orderId,
        },
      }),
    ]);

    return commission;
  }

  async getAffiliateDashboard(tenantId: string, affiliateId: string) {
    const affiliate = await this.prisma.affiliate.findFirst({
      where: { id: affiliateId, tenantId },
    });

    if (!affiliate) {
      throw new NotFoundException('Affiliate not found');
    }

    const [commissions, recentClicks] = await Promise.all([
      this.prisma.affiliateCommission.findMany({
        where: { affiliateId },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      this.prisma.affiliateClick.findMany({
        where: { affiliateId },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
    ]);

    const pendingCommissions = commissions
      .filter(c => c.status === 'PENDING')
      .reduce((sum, c) => sum + c.amount, 0);

    const approvedCommissions = commissions
      .filter(c => c.status === 'APPROVED')
      .reduce((sum, c) => sum + c.amount, 0);

    const paidCommissions = commissions
      .filter(c => c.status === 'PAID')
      .reduce((sum, c) => sum + c.amount, 0);

    return {
      affiliate: {
        id: affiliate.id,
        name: affiliate.name,
        code: affiliate.code,
        commissionRate: affiliate.commissionRate,
        status: affiliate.status,
      },
      stats: {
        totalClicks: affiliate.totalClicks,
        totalConversions: affiliate.totalConversions,
        totalSales: affiliate.totalSales,
        totalCommission: affiliate.totalCommission,
        pendingCommissions,
        approvedCommissions,
        paidCommissions,
        conversionRate: affiliate.totalClicks > 0
          ? Math.round((affiliate.totalConversions / affiliate.totalClicks) * 100 * 100) / 100
          : 0,
      },
      recentCommissions: commissions,
      recentClicks,
    };
  }

  async approveCommission(tenantId: string, dto: ApproveCommissionDto) {
    const commission = await this.prisma.affiliateCommission.findFirst({
      where: {
        id: dto.commissionId,
        affiliate: { tenantId },
      },
    });

    if (!commission) {
      throw new NotFoundException('Commission not found');
    }

    if (commission.status !== 'PENDING') {
      throw new BadRequestException('Commission is not in pending status');
    }

    return this.prisma.affiliateCommission.update({
      where: { id: dto.commissionId },
      data: {
        status: 'APPROVED',
        note: dto.note,
      },
    });
  }

  async markCommissionPaid(tenantId: string, dto: MarkCommissionPaidDto) {
    const commission = await this.prisma.affiliateCommission.findFirst({
      where: {
        id: dto.commissionId,
        affiliate: { tenantId },
      },
    });

    if (!commission) {
      throw new NotFoundException('Commission not found');
    }

    if (commission.status !== 'APPROVED') {
      throw new BadRequestException('Commission must be approved before marking as paid');
    }

    return this.prisma.affiliateCommission.update({
      where: { id: dto.commissionId },
      data: {
        status: 'PAID',
        paidAt: new Date(),
        note: dto.note,
      },
    });
  }

  async exportPayoutCSV(tenantId: string, status: string = 'APPROVED') {
    const commissions = await this.prisma.affiliateCommission.findMany({
      where: {
        affiliate: { tenantId },
        status: status as any,
      },
      include: {
        affiliate: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const csvHeader = [
      'Commission ID',
      'Affiliate Code',
      'Affiliate Name',
      'Affiliate Email',
      'Order ID',
      'Commission Amount (pence)',
      'Status',
      'Created At',
      'Note',
    ].join(',');

    const csvRows = commissions.map(c => [
      c.id,
      c.affiliate.code,
      c.affiliate.name,
      c.affiliate.email || '',
      c.orderId || '',
      c.amount.toString(),
      c.status,
      c.createdAt.toISOString(),
      c.note || '',
    ].join(','));

    return [csvHeader, ...csvRows].join('\n');
  }
}
