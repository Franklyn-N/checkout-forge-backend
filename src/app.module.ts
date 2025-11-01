import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { SecurityHeadersMiddleware } from './common/middleware/security-headers.middleware';
import { TlsCheckMiddleware } from './common/middleware/tls-check.middleware';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CheckoutsModule } from './checkouts/checkouts.module';
import { OrdersModule } from './orders/orders.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { ReportsModule } from './reports/reports.module';
import { GdprModule } from './gdpr/gdpr.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { UpsellsModule } from './upsells/upsells.module';
import { VatModule } from './vat/vat.module';
import { AdminModule } from './admin/admin.module';
import { TemplatesModule } from './templates/templates.module';
import { TemplatesManagerModule } from './templates-manager/templates-manager.module';
import { ABTestingModule } from './ab-testing/ab-testing.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AffiliatesEnhancedModule } from './affiliates/affiliates-enhanced.module';
import { InvoicesModule } from './invoices/invoices.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule,
    AuthModule,
    ProductsModule,
    CheckoutsModule,
    OrdersModule,
    SubscriptionsModule,
    ReportsModule,
    GdprModule,
    WebhooksModule,
    UpsellsModule,
    VatModule,
    AdminModule,
    TemplatesModule,
    TemplatesManagerModule,
    ABTestingModule,
    AnalyticsModule,
    AffiliatesEnhancedModule,
    InvoicesModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SecurityHeadersMiddleware, TlsCheckMiddleware)
      .forRoutes('*');
  }
}

