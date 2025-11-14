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
exports.VatController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const vat_service_1 = require("./vat.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let VatController = class VatController {
    constructor(vatService) {
        this.vatService = vatService;
    }
    async getVATRate(countryCode) {
        return {
            countryCode,
            vatRate: this.vatService.getVATRate(countryCode),
        };
    }
    async calculateVAT(body) {
        return this.vatService.calculateVAT(body);
    }
    async exportVATReport(user, from, to, res) {
        if (!from || !to) {
            throw new common_1.BadRequestException('from and to query parameters are required');
        }
        const fromDate = new Date(from);
        const toDate = new Date(to);
        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
            throw new common_1.BadRequestException('Invalid date format');
        }
        const csv = await this.vatService.exportVATReport({
            tenantId: user.tenantId,
            fromDate,
            toDate,
        });
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="vat-report-${from}-${to}.csv"`);
        res.send(csv);
    }
    async getVATSummary(user, from, to) {
        if (!from || !to) {
            throw new common_1.BadRequestException('from and to query parameters are required');
        }
        const fromDate = new Date(from);
        const toDate = new Date(to);
        return this.vatService.getVATSummary({
            tenantId: user.tenantId,
            fromDate,
            toDate,
        });
    }
    async updateCustomerVATInfo(user, body) {
        return this.vatService.updateCustomerVATInfo({
            ...body,
            tenantId: user.tenantId,
        });
    }
    async validateVATId(body) {
        return {
            vatId: body.vatId,
            valid: this.vatService.isValidEUVATId(body.vatId),
        };
    }
};
exports.VatController = VatController;
__decorate([
    (0, common_1.Get)('rate'),
    (0, swagger_1.ApiOperation)({ summary: 'Get VAT rate for country' }),
    (0, swagger_1.ApiQuery)({ name: 'countryCode', example: 'GB' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'VAT rate retrieved' }),
    __param(0, (0, common_1.Query)('countryCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VatController.prototype, "getVATRate", null);
__decorate([
    (0, common_1.Post)('calculate'),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate VAT for amount' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'VAT calculated' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VatController.prototype, "calculateVAT", null);
__decorate([
    (0, common_1.Get)('export'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN', 'FINANCE'),
    (0, swagger_1.ApiOperation)({ summary: 'Export VAT report as CSV' }),
    (0, swagger_1.ApiQuery)({ name: 'from', example: '2025-01-01' }),
    (0, swagger_1.ApiQuery)({ name: 'to', example: '2025-12-31' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'CSV file generated' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('from')),
    __param(2, (0, common_1.Query)('to')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], VatController.prototype, "exportVATReport", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN', 'FINANCE'),
    (0, swagger_1.ApiOperation)({ summary: 'Get VAT summary for date range' }),
    (0, swagger_1.ApiQuery)({ name: 'from', example: '2025-01-01' }),
    (0, swagger_1.ApiQuery)({ name: 'to', example: '2025-12-31' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'VAT summary generated' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('from')),
    __param(2, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], VatController.prototype, "getVATSummary", null);
__decorate([
    (0, common_1.Post)('customer/update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update customer VAT information' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Customer VAT info updated' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], VatController.prototype, "updateCustomerVATInfo", null);
__decorate([
    (0, common_1.Post)('validate'),
    (0, swagger_1.ApiOperation)({ summary: 'Validate EU VAT ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'VAT ID validation result' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VatController.prototype, "validateVATId", null);
exports.VatController = VatController = __decorate([
    (0, swagger_1.ApiTags)('vat'),
    (0, common_1.Controller)('vat'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [vat_service_1.VatService])
], VatController);
//# sourceMappingURL=vat.controller.js.map