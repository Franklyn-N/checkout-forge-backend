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
exports.ABTestingController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const ab_testing_service_1 = require("./ab-testing.service");
const dto_1 = require("./dto");
let ABTestingController = class ABTestingController {
    constructor(abTestingService) {
        this.abTestingService = abTestingService;
    }
    async createABTest(req, dto) {
        return this.abTestingService.createABTest(req.user.tenantId, dto);
    }
    async listABTests(req, status) {
        return this.abTestingService.listABTests(req.user.tenantId, status);
    }
    async getABTest(req, id) {
        return this.abTestingService.getABTest(req.user.tenantId, id);
    }
    async updateABTest(req, id, dto) {
        return this.abTestingService.updateABTest(req.user.tenantId, id, dto);
    }
    async startABTest(req, id) {
        return this.abTestingService.startABTest(req.user.tenantId, id);
    }
    async pauseABTest(req, id) {
        return this.abTestingService.pauseABTest(req.user.tenantId, id);
    }
    async completeABTest(req, id, winnerVariantId) {
        return this.abTestingService.completeABTest(req.user.tenantId, id, winnerVariantId);
    }
    async assignVariant(req, dto) {
        return this.abTestingService.assignVariant(req.user.tenantId, dto);
    }
    async recordConversion(req, dto) {
        return this.abTestingService.recordConversion(req.user.tenantId, dto);
    }
    async getABTestResults(req, id) {
        return this.abTestingService.getABTestResults(req.user.tenantId, id);
    }
};
exports.ABTestingController = ABTestingController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreateABTestDto]),
    __metadata("design:returntype", Promise)
], ABTestingController.prototype, "createABTest", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN', 'FINANCE', 'SUPPORT'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ABTestingController.prototype, "listABTests", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN', 'FINANCE', 'SUPPORT'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ABTestingController.prototype, "getABTest", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto_1.UpdateABTestDto]),
    __metadata("design:returntype", Promise)
], ABTestingController.prototype, "updateABTest", null);
__decorate([
    (0, common_1.Post)(':id/start'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ABTestingController.prototype, "startABTest", null);
__decorate([
    (0, common_1.Post)(':id/pause'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ABTestingController.prototype, "pauseABTest", null);
__decorate([
    (0, common_1.Post)(':id/complete'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('winnerVariantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ABTestingController.prototype, "completeABTest", null);
__decorate([
    (0, common_1.Post)('assign-variant'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.AssignVariantDto]),
    __metadata("design:returntype", Promise)
], ABTestingController.prototype, "assignVariant", null);
__decorate([
    (0, common_1.Post)('record-conversion'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.RecordConversionDto]),
    __metadata("design:returntype", Promise)
], ABTestingController.prototype, "recordConversion", null);
__decorate([
    (0, common_1.Get)(':id/results'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN', 'FINANCE', 'SUPPORT'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ABTestingController.prototype, "getABTestResults", null);
exports.ABTestingController = ABTestingController = __decorate([
    (0, common_1.Controller)('ab-tests'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [ab_testing_service_1.ABTestingService])
], ABTestingController);
//# sourceMappingURL=ab-testing.controller.js.map