"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const security_headers_middleware_1 = require("./common/middleware/security-headers.middleware");
const tls_check_middleware_1 = require("./common/middleware/tls-check.middleware");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const products_module_1 = require("./products/products.module");
const checkouts_module_1 = require("./checkouts/checkouts.module");
const orders_module_1 = require("./orders/orders.module");
const subscriptions_module_1 = require("./subscriptions/subscriptions.module");
const reports_module_1 = require("./reports/reports.module");
const gdpr_module_1 = require("./gdpr/gdpr.module");
const webhooks_module_1 = require("./webhooks/webhooks.module");
const upsells_module_1 = require("./upsells/upsells.module");
const vat_module_1 = require("./vat/vat.module");
const admin_module_1 = require("./admin/admin.module");
const templates_module_1 = require("./templates/templates.module");
const templates_manager_module_1 = require("./templates-manager/templates-manager.module");
const ab_testing_module_1 = require("./ab-testing/ab-testing.module");
const analytics_module_1 = require("./analytics/analytics.module");
const affiliates_enhanced_module_1 = require("./affiliates/affiliates-enhanced.module");
const invoices_module_1 = require("./invoices/invoices.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(security_headers_middleware_1.SecurityHeadersMiddleware, tls_check_middleware_1.TlsCheckMiddleware)
            .forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            products_module_1.ProductsModule,
            checkouts_module_1.CheckoutsModule,
            orders_module_1.OrdersModule,
            subscriptions_module_1.SubscriptionsModule,
            reports_module_1.ReportsModule,
            gdpr_module_1.GdprModule,
            webhooks_module_1.WebhooksModule,
            upsells_module_1.UpsellsModule,
            vat_module_1.VatModule,
            admin_module_1.AdminModule,
            templates_module_1.TemplatesModule,
            templates_manager_module_1.TemplatesManagerModule,
            ab_testing_module_1.ABTestingModule,
            analytics_module_1.AnalyticsModule,
            affiliates_enhanced_module_1.AffiliatesEnhancedModule,
            invoices_module_1.InvoicesModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map