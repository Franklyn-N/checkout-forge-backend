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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AffiliatesEnhancedController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const affiliates_enhanced_service_1 = require("./affiliates-enhanced.service");
const dto_1 = require("./dto");
let AffiliatesEnhancedController = class AffiliatesEnhancedController {
    constructor(affiliatesService) {
        this.affiliatesService = affiliatesService;
    }
    async registerAffiliate(dto, tenantId) {
        return this.affiliatesService.registerAffiliate(tenantId, dto);
    }
    async listAffiliates(req, status) {
        return this.affiliatesService.listAffiliates(req.user.tenantId, status);
    }
    async getAffiliate(req, id) {
        return this.affiliatesService.getAffiliate(req.user.tenantId, id);
    }
    async updateAffiliate(req, id, dto) {
        return this.affiliatesService.updateAffiliate(req.user.tenantId, id, dto);
    }
    async approveAffiliate(req, id) {
        return this.affiliatesService.approveAffiliate(req.user.tenantId, id, req.user.userId);
    }
    async rejectAffiliate(req, id) {
        return this.affiliatesService.rejectAffiliate(req.user.tenantId, id);
    }
    async trackClick(dto, tenantId) {
        return this.affiliatesService.trackClick(tenantId, dto);
    }
    async recordConversion(dto, tenantId) {
        return this.affiliatesService.recordConversion(tenantId, dto);
    }
    async getAffiliateDashboard(req, id) {
        return this.affiliatesService.getAffiliateDashboard(req.user.tenantId, id);
    }
    async approveCommission(req, dto) {
        return this.affiliatesService.approveCommission(req.user.tenantId, dto);
    }
    async markCommissionPaid(req, dto) {
        return this.affiliatesService.markCommissionPaid(req.user.tenantId, dto);
    }
    async exportPayouts(req, res, status) {
        const csv = await this.affiliatesService.exportPayoutCSV(req.user.tenantId, status);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=affiliate-payouts.csv');
        res.send(csv);
    }
};
exports.AffiliatesEnhancedController = AffiliatesEnhancedController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.RegisterAffiliateDto, String]),
    __metadata("design:returntype", Promise)
], AffiliatesEnhancedController.prototype, "registerAffiliate", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN', 'FINANCE'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AffiliatesEnhancedController.prototype, "listAffiliates", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN', 'FINANCE'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AffiliatesEnhancedController.prototype, "getAffiliate", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto_1.UpdateAffiliateDto]),
    __metadata("design:returntype", Promise)
], AffiliatesEnhancedController.prototype, "updateAffiliate", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AffiliatesEnhancedController.prototype, "approveAffiliate", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AffiliatesEnhancedController.prototype, "rejectAffiliate", null);
__decorate([
    (0, common_1.Post)('track-click'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.TrackClickDto, String]),
    __metadata("design:returntype", Promise)
], AffiliatesEnhancedController.prototype, "trackClick", null);
__decorate([
    (0, common_1.Post)('record-conversion'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.RecordConversionDto, String]),
    __metadata("design:returntype", Promise)
], AffiliatesEnhancedController.prototype, "recordConversion", null);
__decorate([
    (0, common_1.Get)(':id/dashboard'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN', 'FINANCE'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AffiliatesEnhancedController.prototype, "getAffiliateDashboard", null);
__decorate([
    (0, common_1.Post)('commissions/approve'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN', 'FINANCE'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.ApproveCommissionDto]),
    __metadata("design:returntype", Promise)
], AffiliatesEnhancedController.prototype, "approveCommission", null);
__decorate([
    (0, common_1.Post)('commissions/mark-paid'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN', 'FINANCE'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.MarkCommissionPaidDto]),
    __metadata("design:returntype", Promise)
], AffiliatesEnhancedController.prototype, "markCommissionPaid", null);
__decorate([
    (0, common_1.Get)('export/payouts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN', 'FINANCE'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], AffiliatesEnhancedController.prototype, "exportPayouts", null);
exports.AffiliatesEnhancedController = AffiliatesEnhancedController = __decorate([
    (0, common_1.Controller)('affiliates'),
    __metadata("design:paramtypes", [affiliates_enhanced_service_1.AffiliatesEnhancedService])
], AffiliatesEnhancedController);
//# sourceMappingURL=affiliates-enhanced.controller.js.map