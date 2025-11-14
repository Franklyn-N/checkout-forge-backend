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
exports.UpsellsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const upsells_service_1 = require("./upsells.service");
let UpsellsController = class UpsellsController {
    constructor(upsellsService) {
        this.upsellsService = upsellsService;
    }
    async getUpsellOffer(orderId, tenantId) {
        return this.upsellsService.getUpsellOffer(orderId, tenantId);
    }
    async processOneClickUpsell(orderId, upsellOfferId, tenantId) {
        return this.upsellsService.processOneClickUpsell(orderId, upsellOfferId, tenantId);
    }
    async declineUpsell(orderId, upsellOfferId, tenantId) {
        return this.upsellsService.declineUpsell(orderId, upsellOfferId, tenantId);
    }
};
exports.UpsellsController = UpsellsController;
__decorate([
    (0, common_1.Get)('offer/:orderId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get post-purchase upsell offer for order' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Upsell offer retrieved' }),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UpsellsController.prototype, "getUpsellOffer", null);
__decorate([
    (0, common_1.Post)('process/:orderId/:upsellOfferId'),
    (0, swagger_1.ApiOperation)({ summary: 'Process one-click upsell with saved payment method' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Upsell processed' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Payment failed' }),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Param)('upsellOfferId')),
    __param(2, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], UpsellsController.prototype, "processOneClickUpsell", null);
__decorate([
    (0, common_1.Post)('decline/:orderId/:upsellOfferId'),
    (0, swagger_1.ApiOperation)({ summary: 'Decline upsell offer' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Upsell declined' }),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Param)('upsellOfferId')),
    __param(2, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], UpsellsController.prototype, "declineUpsell", null);
exports.UpsellsController = UpsellsController = __decorate([
    (0, swagger_1.ApiTags)('upsells'),
    (0, common_1.Controller)('upsells'),
    __metadata("design:paramtypes", [upsells_service_1.UpsellsService])
], UpsellsController);
//# sourceMappingURL=upsells.controller.js.map