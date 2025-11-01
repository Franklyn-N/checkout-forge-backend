"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutsModule = void 0;
const common_1 = require("@nestjs/common");
const checkouts_controller_1 = require("./checkouts.controller");
const checkouts_service_1 = require("./checkouts.service");
const stripe_service_1 = require("./stripe.service");
let CheckoutsModule = class CheckoutsModule {
};
exports.CheckoutsModule = CheckoutsModule;
exports.CheckoutsModule = CheckoutsModule = __decorate([
    (0, common_1.Module)({
        controllers: [checkouts_controller_1.CheckoutsController],
        providers: [checkouts_service_1.CheckoutsService, stripe_service_1.StripeService],
        exports: [checkouts_service_1.CheckoutsService, stripe_service_1.StripeService],
    })
], CheckoutsModule);
//# sourceMappingURL=checkouts.module.js.map