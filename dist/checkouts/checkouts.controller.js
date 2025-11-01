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
exports.CheckoutsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const checkouts_service_1 = require("./checkouts.service");
const dto_1 = require("./dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let CheckoutsController = class CheckoutsController {
    constructor(checkoutsService) {
        this.checkoutsService = checkoutsService;
    }
    async getCheckout(slug, user) {
        return this.checkoutsService.getCheckoutPage(slug, user.tenantId);
    }
    async createSession(checkoutId, dto, user) {
        return this.checkoutsService.createCheckoutSession(checkoutId, dto, user.tenantId);
    }
};
exports.CheckoutsController = CheckoutsController;
__decorate([
    (0, common_1.Get)(':slug'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get checkout page by slug' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Checkout page found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Checkout page not found' }),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CheckoutsController.prototype, "getCheckout", null);
__decorate([
    (0, common_1.Post)(':checkoutId/session'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create Stripe checkout session' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Session created with clientSecret' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Checkout page not found' }),
    __param(0, (0, common_1.Param)('checkoutId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.CreateCheckoutSessionDto, Object]),
    __metadata("design:returntype", Promise)
], CheckoutsController.prototype, "createSession", null);
exports.CheckoutsController = CheckoutsController = __decorate([
    (0, swagger_1.ApiTags)('checkouts'),
    (0, common_1.Controller)('checkouts'),
    __metadata("design:paramtypes", [checkouts_service_1.CheckoutsService])
], CheckoutsController);
//# sourceMappingURL=checkouts.controller.js.map