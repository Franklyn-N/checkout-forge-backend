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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const admin_service_1 = require("./admin.service");
const dto_1 = require("./dto");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async createProduct(req, dto) {
        return this.adminService.createProduct(req.user.tenantId, dto);
    }
    async listProducts(req, page, limit) {
        return this.adminService.listProducts(req.user.tenantId, page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 20);
    }
    async getProduct(req, id) {
        return this.adminService.getProduct(req.user.tenantId, id);
    }
    async updateProduct(req, id, dto) {
        return this.adminService.updateProduct(req.user.tenantId, id, dto);
    }
    async deleteProduct(req, id) {
        return this.adminService.deleteProduct(req.user.tenantId, id);
    }
    async createPrice(req, dto) {
        return this.adminService.createPrice(req.user.tenantId, dto);
    }
    async updatePrice(req, id, dto) {
        return this.adminService.updatePrice(req.user.tenantId, id, dto);
    }
    async deletePrice(req, id) {
        return this.adminService.deletePrice(req.user.tenantId, id);
    }
    async listOrders(req, page, limit, status) {
        return this.adminService.listOrders(req.user.tenantId, page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 20, status);
    }
    async getOrder(req, id) {
        return this.adminService.getOrder(req.user.tenantId, id);
    }
    async processRefund(req, dto) {
        return this.adminService.processRefund(req.user.tenantId, dto, req.user.userId);
    }
    async listSubscriptions(req, page, limit, status) {
        return this.adminService.listSubscriptions(req.user.tenantId, page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 20, status);
    }
    async cancelSubscription(req, id) {
        return this.adminService.cancelSubscription(req.user.tenantId, id);
    }
    async getDunningDashboard(req) {
        return this.adminService.getDunningDashboard(req.user.tenantId);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Post)('products'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreateProductDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Get)('products'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN', 'FINANCE', 'SUPPORT'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listProducts", null);
__decorate([
    (0, common_1.Get)('products/:id'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN', 'FINANCE', 'SUPPORT'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getProduct", null);
__decorate([
    (0, common_1.Put)('products/:id'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto_1.UpdateProductDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Delete)('products/:id'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteProduct", null);
__decorate([
    (0, common_1.Post)('prices'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreatePriceDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createPrice", null);
__decorate([
    (0, common_1.Put)('prices/:id'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto_1.UpdatePriceDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updatePrice", null);
__decorate([
    (0, common_1.Delete)('prices/:id'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deletePrice", null);
__decorate([
    (0, common_1.Get)('orders'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN', 'FINANCE', 'SUPPORT'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listOrders", null);
__decorate([
    (0, common_1.Get)('orders/:id'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN', 'FINANCE', 'SUPPORT'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getOrder", null);
__decorate([
    (0, common_1.Post)('refunds'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN', 'FINANCE'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.ProcessRefundDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "processRefund", null);
__decorate([
    (0, common_1.Get)('subscriptions'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN', 'FINANCE', 'SUPPORT'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listSubscriptions", null);
__decorate([
    (0, common_1.Post)('subscriptions/:id/cancel'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN', 'FINANCE'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "cancelSubscription", null);
__decorate([
    (0, common_1.Get)('dunning/dashboard'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN', 'FINANCE'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDunningDashboard", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map