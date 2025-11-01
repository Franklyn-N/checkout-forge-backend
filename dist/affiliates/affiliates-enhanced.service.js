"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AffiliatesEnhancedService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AffiliatesEnhancedService = class AffiliatesEnhancedService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async registerAffiliate(tenantId, dto) {
        const existing = await this.prisma.affiliate.findFirst({
            where: {
                tenantId,
                code: dto.code,
            },
        });
        if (existing) {
            throw new common_1.ConflictException('Affiliate code already exists');
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
    async listAffiliates(tenantId, status) {
        const where = { tenantId };
        if (status) {
            where.status = status;
        }
        return this.prisma.affiliate.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }
    async getAffiliate(tenantId, affiliateId) {
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
            throw new common_1.NotFoundException('Affiliate not found');
        }
        return affiliate;
    }
    async updateAffiliate(tenantId, affiliateId, dto) {
        const affiliate = await this.prisma.affiliate.findFirst({
            where: { id: affiliateId, tenantId },
        });
        if (!affiliate) {
            throw new common_1.NotFoundException('Affiliate not found');
        }
        return this.prisma.affiliate.update({
            where: { id: affiliateId },
            data: dto,
        });
    }
    async approveAffiliate(tenantId, affiliateId, userId) {
        const affiliate = await this.prisma.affiliate.findFirst({
            where: { id: affiliateId, tenantId },
        });
        if (!affiliate) {
            throw new common_1.NotFoundException('Affiliate not found');
        }
        if (affiliate.status !== 'PENDING') {
            throw new common_1.BadRequestException('Affiliate is not in pending status');
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
    async rejectAffiliate(tenantId, affiliateId) {
        const affiliate = await this.prisma.affiliate.findFirst({
            where: { id: affiliateId, tenantId },
        });
        if (!affiliate) {
            throw new common_1.NotFoundException('Affiliate not found');
        }
        return this.prisma.affiliate.update({
            where: { id: affiliateId },
            data: {
                status: 'REJECTED',
                isActive: false,
            },
        });
    }
    async trackClick(tenantId, dto) {
        const affiliate = await this.prisma.affiliate.findFirst({
            where: {
                tenantId,
                code: dto.affiliateCode,
                status: 'APPROVED',
                isActive: true,
            },
        });
        if (!affiliate) {
            throw new common_1.NotFoundException('Affiliate not found or not active');
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
    async recordConversion(tenantId, dto) {
        const affiliate = await this.prisma.affiliate.findFirst({
            where: { id: dto.affiliateId, tenantId },
        });
        if (!affiliate) {
            throw new common_1.NotFoundException('Affiliate not found');
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
    async getAffiliateDashboard(tenantId, affiliateId) {
        const affiliate = await this.prisma.affiliate.findFirst({
            where: { id: affiliateId, tenantId },
        });
        if (!affiliate) {
            throw new common_1.NotFoundException('Affiliate not found');
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
    async approveCommission(tenantId, dto) {
        const commission = await this.prisma.affiliateCommission.findFirst({
            where: {
                id: dto.commissionId,
                affiliate: { tenantId },
            },
        });
        if (!commission) {
            throw new common_1.NotFoundException('Commission not found');
        }
        if (commission.status !== 'PENDING') {
            throw new common_1.BadRequestException('Commission is not in pending status');
        }
        return this.prisma.affiliateCommission.update({
            where: { id: dto.commissionId },
            data: {
                status: 'APPROVED',
                note: dto.note,
            },
        });
    }
    async markCommissionPaid(tenantId, dto) {
        const commission = await this.prisma.affiliateCommission.findFirst({
            where: {
                id: dto.commissionId,
                affiliate: { tenantId },
            },
        });
        if (!commission) {
            throw new common_1.NotFoundException('Commission not found');
        }
        if (commission.status !== 'APPROVED') {
            throw new common_1.BadRequestException('Commission must be approved before marking as paid');
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
    async exportPayoutCSV(tenantId, status = 'APPROVED') {
        const commissions = await this.prisma.affiliateCommission.findMany({
            where: {
                affiliate: { tenantId },
                status: status,
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
};
exports.AffiliatesEnhancedService = AffiliatesEnhancedService;
exports.AffiliatesEnhancedService = AffiliatesEnhancedService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AffiliatesEnhancedService);
//# sourceMappingURL=affiliates-enhanced.service.js.map