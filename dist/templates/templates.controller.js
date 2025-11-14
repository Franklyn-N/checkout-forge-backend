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
exports.TemplatesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const templates_service_1 = require("./templates.service");
const dto_1 = require("./dto");
let TemplatesController = class TemplatesController {
    constructor(templatesService) {
        this.templatesService = templatesService;
    }
    async createTemplate(req, dto) {
        return this.templatesService.createTemplate(req.user.tenantId, dto);
    }
    async listTemplates(req, includePublic) {
        return this.templatesService.listTemplates(req.user.tenantId, includePublic === 'true');
    }
    async getTemplate(req, id) {
        return this.templatesService.getTemplate(req.user.tenantId, id);
    }
    async updateTemplate(req, id, dto) {
        return this.templatesService.updateTemplate(req.user.tenantId, id, dto);
    }
    async deleteTemplate(req, id) {
        return this.templatesService.deleteTemplate(req.user.tenantId, id);
    }
    async assignTemplate(req, dto) {
        return this.templatesService.assignTemplate(req.user.tenantId, dto);
    }
    async updateCheckoutBlocks(req, dto) {
        return this.templatesService.updateCheckoutBlocks(req.user.tenantId, dto);
    }
    async getCheckoutBlocks(req, checkoutPageId) {
        return this.templatesService.getCheckoutBlocks(req.user.tenantId, checkoutPageId);
    }
};
exports.TemplatesController = TemplatesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreateTemplateDto]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "createTemplate", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN', 'FINANCE', 'SUPPORT'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('includePublic')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "listTemplates", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN', 'FINANCE', 'SUPPORT'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "getTemplate", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto_1.UpdateTemplateDto]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "updateTemplate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "deleteTemplate", null);
__decorate([
    (0, common_1.Post)('assign'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.AssignTemplateDto]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "assignTemplate", null);
__decorate([
    (0, common_1.Put)('checkout-blocks'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.UpdateCheckoutBlocksDto]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "updateCheckoutBlocks", null);
__decorate([
    (0, common_1.Get)('checkout-blocks/:checkoutPageId'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN', 'FINANCE', 'SUPPORT'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('checkoutPageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "getCheckoutBlocks", null);
exports.TemplatesController = TemplatesController = __decorate([
    (0, common_1.Controller)('templates'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [templates_service_1.TemplatesService])
], TemplatesController);
//# sourceMappingURL=templates.controller.js.map