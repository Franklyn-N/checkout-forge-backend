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
exports.TemplatesManagerController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const templates_manager_service_1 = require("./templates-manager.service");
const dto_1 = require("./dto");
let TemplatesManagerController = class TemplatesManagerController {
    constructor(templatesService) {
        this.templatesService = templatesService;
    }
    async uploadTemplate(user, dto, files) {
        if (!files.html || files.html.length === 0) {
            throw new Error('HTML file is required');
        }
        return this.templatesService.uploadTemplate(user.tenantId, user.id, dto, files.html[0], files.thumbnail?.[0]);
    }
    async listTemplates(user, query) {
        return this.templatesService.listTemplates(user.tenantId, query);
    }
    async getTemplate(user, id) {
        return this.templatesService.getTemplate(user.tenantId, id);
    }
    async publishTemplate(user, id, dto) {
        return this.templatesService.publishTemplate(user.tenantId, user.id, id, dto);
    }
    async deleteTemplate(user, id) {
        return this.templatesService.deleteTemplate(user.tenantId, user.id, id);
    }
};
exports.TemplatesManagerController = TemplatesManagerController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload a new template' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'html', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 },
    ])),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.UploadTemplateDto, Object]),
    __metadata("design:returntype", Promise)
], TemplatesManagerController.prototype, "uploadTemplate", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all templates' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.QueryTemplatesDto]),
    __metadata("design:returntype", Promise)
], TemplatesManagerController.prototype, "listTemplates", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get template by ID' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TemplatesManagerController.prototype, "getTemplate", null);
__decorate([
    (0, common_1.Post)(':id/publish'),
    (0, swagger_1.ApiOperation)({ summary: 'Publish a template version' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto_1.PublishTemplateDto]),
    __metadata("design:returntype", Promise)
], TemplatesManagerController.prototype, "publishTemplate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a template' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TemplatesManagerController.prototype, "deleteTemplate", null);
exports.TemplatesManagerController = TemplatesManagerController = __decorate([
    (0, swagger_1.ApiTags)('templates-manager'),
    (0, common_1.Controller)('templates-manager'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [templates_manager_service_1.TemplatesManagerService])
], TemplatesManagerController);
//# sourceMappingURL=templates-manager.controller.js.map