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
exports.GdprService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let GdprService = class GdprService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async logConsent(params) {
        return this.prisma.customer.update({
            where: { id: params.customerId },
            data: {
                gdprConsent: params.granted,
                gdprConsentDate: new Date(),
            },
        });
    }
    async exportCustomerData(customerId, tenantId) {
        const customer = await this.prisma.customer.findFirst({
            where: { id: customerId, tenantId },
            include: {
                orders: {
                    include: {
                        items: {
                            include: {
                                product: true,
                                price: true,
                            },
                        },
                        refunds: true,
                    },
                },
                subscriptions: {
                    include: {
                        price: {
                            include: {
                                product: true,
                            },
                        },
                    },
                },
            },
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        return {
            exportDate: new Date().toISOString(),
            customer: {
                id: customer.id,
                email: customer.email,
                firstName: customer.firstName,
                lastName: customer.lastName,
                phone: customer.phone,
                billingAddress: customer.billingAddress,
                shippingAddress: customer.shippingAddress,
                createdAt: customer.createdAt,
                gdprConsent: customer.gdprConsent,
                gdprConsentDate: customer.gdprConsentDate,
            },
            orders: customer.orders,
            subscriptions: customer.subscriptions,
        };
    }
    async deleteCustomerData(customerId, tenantId) {
        const customer = await this.prisma.customer.findFirst({
            where: { id: customerId, tenantId },
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        await this.prisma.customer.update({
            where: { id: customerId },
            data: {
                email: `deleted-${customerId}@anonymized.local`,
                firstName: 'DELETED',
                lastName: 'DELETED',
                phone: null,
                billingAddress: null,
                shippingAddress: null,
                metadata: { gdpr_deleted: true, deletedAt: new Date().toISOString() },
            },
        });
        return {
            success: true,
            message: 'Customer data anonymized',
            customerId,
        };
    }
};
exports.GdprService = GdprService;
exports.GdprService = GdprService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GdprService);
//# sourceMappingURL=gdpr.service.js.map