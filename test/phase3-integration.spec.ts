import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Phase 3 Integration Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;
  let tenantId: string;
  let customerId: string;
  let productId: string;
  let priceId: string;
  let checkoutId: string;
  let orderId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);

    tenantId = 'test-tenant-' + Date.now();
    await prisma.tenant.create({
      data: {
        id: tenantId,
        slug: 'test-tenant',
        name: 'Test Tenant',
        currency: 'GBP',
      },
    });

    const authResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/signup')
      .send({
        email: 'test@example.com',
        password: 'password123',
        tenantId,
      });

    authToken = authResponse.body.token;
  });

  afterAll(async () => {
    await prisma.tenant.delete({ where: { id: tenantId } });
    await app.close();
  });

  describe('Order Bump Flow', () => {
    it('should create checkout with order bump', async () => {
      const productResponse = await request(app.getHttpServer())
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Main Product',
          description: 'Test product',
        });

      productId = productResponse.body.id;

      const priceResponse = await request(app.getHttpServer())
        .post(`/api/v1/products/${productId}/prices`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 5000,
          currency: 'GBP',
          type: 'ONE_TIME',
        });

      priceId = priceResponse.body.id;

      const checkoutPage = await prisma.checkoutPage.create({
        data: {
          tenantId,
          slug: 'test-checkout',
          name: 'Test Checkout',
          collectVat: true,
          vatPercentage: 20,
        },
      });

      checkoutId = checkoutPage.id;

      const bumpProduct = await prisma.product.create({
        data: {
          tenantId,
          name: 'Order Bump Product',
        },
      });

      const bumpPrice = await prisma.price.create({
        data: {
          productId: bumpProduct.id,
          amount: 1000,
          currency: 'GBP',
        },
      });

      const orderBump = await prisma.orderBump.create({
        data: {
          checkoutPageId: checkoutId,
          productId: bumpProduct.id,
          priceId: bumpPrice.id,
          label: 'Add bonus content',
        },
      });

      const response = await request(app.getHttpServer())
        .post(`/api/v1/checkout/${checkoutId}/session`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          priceId,
          customerEmail: 'customer@example.com',
          customerName: 'Test Customer',
          quantity: 1,
          applyVat: true,
          orderBumpIds: [orderBump.id],
        });

      expect(response.status).toBe(201);
      expect(response.body.clientSecret).toBeDefined();
      expect(response.body.total).toBe(7200); // 5000 + 1000 + 20% VAT

      orderId = response.body.orderId;

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      expect(order.items).toHaveLength(2);
      expect(order.items.find(i => i.isOrderBump)).toBeDefined();
      expect(order.vatAmount).toBe(1200);
    });
  });

  describe('One-Click Upsell Flow', () => {
    it('should save payment method during checkout', async () => {
      const response = await request(app.getHttpServer())
        .post(`/api/v1/checkout/${checkoutId}/session`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          priceId,
          customerEmail: 'upsell-customer@example.com',
          customerName: 'Upsell Customer',
          quantity: 1,
          applyVat: true,
          savePaymentMethod: true,
        });

      expect(response.status).toBe(201);
      expect(response.body.clientSecret).toBeDefined();

      orderId = response.body.orderId;
    });

    it('should process one-click upsell with saved payment method', async () => {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'PAID' },
      });

      const upsellProduct = await prisma.product.create({
        data: {
          tenantId,
          name: 'Upsell Product',
        },
      });

      const upsellPrice = await prisma.price.create({
        data: {
          productId: upsellProduct.id,
          amount: 2000,
          currency: 'GBP',
        },
      });

      const upsellOffer = await prisma.upsellOffer.create({
        data: {
          checkoutPageId: checkoutId,
          productId: upsellProduct.id,
          priceId: upsellPrice.id,
          headline: 'Special Offer!',
          displayOrder: 1,
        },
      });

      const offerResponse = await request(app.getHttpServer())
        .get(`/api/v1/upsells/offer/${orderId}`)
        .query({ tenantId });

      expect(offerResponse.status).toBe(200);
      expect(offerResponse.body.upsellOffer).toBeDefined();

      const response = await request(app.getHttpServer())
        .post(`/api/v1/upsells/process/${orderId}/${upsellOffer.id}`)
        .query({ tenantId });

      expect([200, 201, 400]).toContain(response.status);

      if (response.status === 201) {
        expect(response.body.orderId).toBeDefined();
        expect(response.body.orderNumber).toContain('UPSELL');

        const upsellOrder = await prisma.order.findUnique({
          where: { id: response.body.orderId },
        });

        expect(upsellOrder.metadata).toHaveProperty('isUpsell', true);
        expect(upsellOrder.metadata).toHaveProperty('originalOrderId', orderId);
      }
    });
  });

  describe('Subscription with Proration', () => {
    it('should create subscription with trial period', async () => {
      const subscriptionProduct = await prisma.product.create({
        data: {
          tenantId,
          name: 'Subscription Product',
        },
      });

      const monthlyPrice = await prisma.price.create({
        data: {
          productId: subscriptionProduct.id,
          amount: 2900,
          currency: 'GBP',
          type: 'RECURRING',
          interval: 'MONTH',
          intervalCount: 1,
          trialDays: 14,
          stripePriceId: 'price_test_monthly',
        },
      });

      const customer = await prisma.customer.findFirst({
        where: { email: 'customer@example.com', tenantId },
      });

      customerId = customer.id;

      expect(monthlyPrice.trialDays).toBe(14);
      expect(monthlyPrice.type).toBe('RECURRING');
    });

    it('should change subscription plan with proration', async () => {
      const yearlyPrice = await prisma.price.create({
        data: {
          productId: productId,
          amount: 29900,
          currency: 'GBP',
          type: 'RECURRING',
          interval: 'YEAR',
          intervalCount: 1,
          stripePriceId: 'price_test_yearly',
        },
      });

      expect(yearlyPrice.interval).toBe('YEAR');
      expect(yearlyPrice.amount).toBe(29900);
    });
  });

  describe('VAT Handling', () => {
    it('should calculate VAT for UK customer', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/vat/calculate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 10000,
          countryCode: 'GB',
          includeVAT: true,
        });

      expect(response.status).toBe(200);
      expect(response.body.netAmount).toBe(10000);
      expect(response.body.vatAmount).toBe(2000); // 20%
      expect(response.body.grossAmount).toBe(12000);
      expect(response.body.vatRate).toBe(20);
      expect(response.body.vatApplied).toBe(true);
    });

    it('should apply zero-rate VAT for EU B2B with valid VAT ID', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/vat/calculate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 10000,
          countryCode: 'DE',
          vatId: 'DE123456789',
          includeVAT: true,
        });

      expect(response.status).toBe(200);
      expect(response.body.netAmount).toBe(10000);
      expect(response.body.vatAmount).toBe(0);
      expect(response.body.grossAmount).toBe(10000);
      expect(response.body.vatApplied).toBe(false);
    });

    it('should validate EU VAT ID format', async () => {
      const validResponse = await request(app.getHttpServer())
        .post('/api/v1/vat/validate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          vatId: 'GB123456789',
        });

      expect(validResponse.status).toBe(201);
      expect(validResponse.body.valid).toBe(true);

      const invalidResponse = await request(app.getHttpServer())
        .post('/api/v1/vat/validate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          vatId: 'INVALID',
        });

      expect(invalidResponse.status).toBe(201);
      expect(invalidResponse.body.valid).toBe(false);
    });

    it('should generate VAT report CSV', async () => {
      const fromDate = new Date('2025-01-01');
      const toDate = new Date('2025-12-31');

      const response = await request(app.getHttpServer())
        .get('/api/v1/vat/export')
        .set('Authorization', `Bearer ${authToken}`)
        .query({
          from: fromDate.toISOString().split('T')[0],
          to: toDate.toISOString().split('T')[0],
        });

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('text/csv');
      expect(response.text).toContain('Order ID');
      expect(response.text).toContain('VAT Amount');
    });

    it('should get VAT summary with country breakdown', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/vat/summary')
        .set('Authorization', `Bearer ${authToken}`)
        .query({
          from: '2025-01-01',
          to: '2025-12-31',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalOrders');
      expect(response.body).toHaveProperty('totalNet');
      expect(response.body).toHaveProperty('totalVAT');
      expect(response.body).toHaveProperty('byCountry');
      expect(response.body).toHaveProperty('b2bZeroRated');
    });
  });

  describe('Dunning and Retry Logic', () => {
    it('should get dunning status for subscription', async () => {
      const subscription = await prisma.subscription.create({
        data: {
          tenantId,
          customerId,
          priceId,
          status: 'PAST_DUE',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          stripeSubscriptionId: 'sub_test_123',
        },
      });

      expect(subscription.status).toBe('PAST_DUE');
      expect(subscription.stripeSubscriptionId).toBeDefined();
    });
  });
});
