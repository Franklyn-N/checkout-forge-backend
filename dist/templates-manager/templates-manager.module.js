"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplatesManagerModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const templates_manager_controller_1 = require("./templates-manager.controller");
const templates_manager_service_1 = require("./templates-manager.service");
const s3_upload_service_1 = require("./s3-upload.service");
const template_validator_service_1 = require("./template-validator.service");
const prisma_module_1 = require("../prisma/prisma.module");
let TemplatesManagerModule = class TemplatesManagerModule {
};
exports.TemplatesManagerModule = TemplatesManagerModule;
exports.TemplatesManagerModule = TemplatesManagerModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, config_1.ConfigModule],
        controllers: [templates_manager_controller_1.TemplatesManagerController],
        providers: [templates_manager_service_1.TemplatesManagerService, s3_upload_service_1.S3UploadService, template_validator_service_1.TemplateValidatorService],
        exports: [templates_manager_service_1.TemplatesManagerService],
    })
], TemplatesManagerModule);
//# sourceMappingURL=templates-manager.module.js.map