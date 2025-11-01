import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Phase 4: Admin & Merchant Features (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;
  let tenantId: string;
  let productId: string;
  let priceId: string;
  let orderId: string;
  let affiliateId: string;
  let abTestId: string;
  let templateId: string;
  let checkoutPageId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);

    const tenant = await prisma.tenant.create({
      data: {
        slug: 'test-phase4',
        name: 'Test Phase 4 Tenant',
        currency: 'GBP',
        country: 'GB',
      },
    });
    tenantId = tenant.id;

    const hashedPassword = '$2b$10$YourHashedPasswordHere';
    await prisma.userAccount.create({
      data: {
        email: 'admin@phase4test.com',
        passwordHash: hashedPassword,
        role: 'OWNER',
        tenantId,
        firstName: 'Admin',
        lastName: 'User',
      },
    });

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@phase4test.com',
        password: 'testpassword',
      });

    authToken = loginResponse.body.accessToken;
  });

  afterAll(async () => {
    await prisma.tenant.delete({ where: { id: tenantId } });
    await app.close();
  });

  describe('Admin Product CRUD', () => {
    it('should create a product', async () => {
      const response = await request(app.getHttpServer())
        .post('/admin/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Product',
          description: 'Test product description',
          imageUrl: 'https://example.com/image.jpg',
          isActive: true,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Test Product');
      productId = response.body.id;
    });

    it('should list products', async () => {
      const response = await request(app.getHttpServer())
        .get('/admin/products')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.meta.total).toBeGreaterThan(0);
    });

    it('should create a price variant', async () => {
      const response = await request(app.getHttpServer())
        .post('/admin/prices')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productId,
          amount: 2999,
          currency: 'GBP',
          type: 'ONE_TIME',
          isActive: true,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.amount).toBe(2999);
      priceId = response.body.id;
    });
  });

  describe('Page Templates', () => {
    it('should create a page template', async () => {
      const response = await request(app.getHttpServer())
        .post('/templates')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Template',
          description: 'A test checkout template',
          blocks: [
            { type: 'heading', content: 'Checkout' },
            { type: 'product', content: null },
            { type: 'payment', content: null },
          ],
          defaultSettings: { theme: 'light' },
          isPublic: false,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Test Template');
      templateId = response.body.id;
    });

    it('should list templates', async () => {
      const response = await request(app.getHttpServer())
        .get('/templates')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('A/B Testing', () => {
    beforeAll(async () => {
      const checkoutPage1 = await prisma.checkoutPage.create({
        data: {
          tenantId,
          slug: 'test-variant-a',
          name: 'Variant A',
          isActive: true,
        },
      });

      const checkoutPage2 = await prisma.checkoutPage.create({
        data: {
          tenantId,
          slug: 'test-variant-b',
          name: 'Variant B',
          isActive: true,
        },
      });

      checkoutPageId = checkoutPage1.id;
    });

    it('should create an A/B test', async () => {
      const checkoutPages = await prisma.checkoutPage.findMany({
        where: { tenantId },
      });

      const response = await request(app.getHttpServer())
        .post('/ab-tests')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test A/B Experiment',
          description: 'Testing two checkout variations',
          trafficSplit: 50,
          variants: [
            {
              checkoutPageId: checkoutPages[0].id,
              name: 'Control',
              isControl: true,
            },
            {
              checkoutPageId: checkoutPages[1].id,
              name: 'Variant B',
              isControl: false,
            },
          ],
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Test A/B Experiment');
      expect(response.body.variants).toHaveLength(2);
      abTestId = response.body.id;
    });

    it('should start an A/B test', async () => {
      const response = await request(app.getHttpServer())
        .post(`/ab-tests/${abTestId}/start`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(201);

      expect(response.body.status).toBe('RUNNING');
    });

    it('should get A/B test results', async () => {
      const response = await request(app.getHttpServer())
        .get(`/ab-tests/${abTestId}/results`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('abTest');
      expect(response.body).toHaveProperty('results');
      expect(response.body.results).toHaveLength(2);
    });
  });

  describe('Analytics Dashboard', () => {
    it('should get analytics dashboard', async () => {
      const response = await request(app.getHttpServer())
        .get('/analytics/dashboard')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('summary');
      expect(response.body.summary).toHaveProperty('revenue');
      expect(response.body.summary).toHaveProperty('conversionRate');
      expect(response.body.summary).toHaveProperty('aov');
    });

    it('should get funnel analytics', async () => {
      const response = await request(app.getHttpServer())
        .get('/analytics/funnel')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(4);
    });
  });

  describe('Affiliate Center', () => {
    it('should register an affiliate', async () => {
      const response = await request(app.getHttpServer())
        .post(`/affiliates/register?tenantId=${tenantId}`)
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          code: 'JOHNDOE',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.code).toBe('JOHNDOE');
      expect(response.body.status).toBe('PENDING');
      affiliateId = response.body.id;
    });

    it('should list affiliates', async () => {
      const response = await request(app.getHttpServer())
        .get('/affiliates')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should approve an affiliate', async () => {
      const response = await request(app.getHttpServer())
        .post(`/affiliates/${affiliateId}/approve`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(201);

      expect(response.body.status).toBe('APPROVED');
      expect(response.body.isActive).toBe(true);
    });

    it('should track affiliate click', async () => {
      const response = await request(app.getHttpServer())
        .post(`/affiliates/track-click?tenantId=${tenantId}`)
        .send({
          affiliateCode: 'JOHNDOE',
          ip: '192.168.1.1',
          userAgent: 'Mozilla/5.0',
          landingPage: 'https://example.com/product',
        })
        .expect(201);

      expect(response.body).toHaveProperty('clickId');
      expect(response.body.affiliateId).toBe(affiliateId);
    });

    it('should get affiliate dashboard', async () => {
      const response = await request(app.getHttpServer())
        .get(`/affiliates/${affiliateId}/dashboard`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('affiliate');
      expect(response.body).toHaveProperty('stats');
      expect(response.body.stats).toHaveProperty('totalClicks');
      expect(response.body.stats).toHaveProperty('totalConversions');
    });

    it('should export affiliate payouts CSV', async () => {
      const response = await request(app.getHttpServer())
        .get('/affiliates/export/payouts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.headers['content-type']).toContain('text/csv');
      expect(response.text).toContain('Commission ID');
    });
  });

  describe('Invoice Generation', () => {
    beforeAll(async () => {
      const customer = await prisma.customer.create({
        data: {
          tenantId,
          email: 'customer@test.com',
          firstName: 'Test',
          lastName: 'Customer',
        },
      });

      const order = await prisma.order.create({
        data: {
          tenantId,
          customerId: customer.id,
          orderNumber: 'ORD-TEST-001',
          status: 'PAID',
          subtotal: 2999,
          total: 2999,
          currency: 'GBP',
        },
      });

      orderId = order.id;
    });

    it('should generate an invoice', async () => {
      const response = await request(app.getHttpServer())
        .post('/invoices/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          orderId,
        })
        .expect(201);

      expect(response.body).toHaveProperty('invoiceNumber');
      expect(response.body.invoiceNumber).toMatch(/INV-\d{4}-\d{5}/);
    });

    it('should list invoices', async () => {
      const response = await request(app.getHttpServer())
        .get('/invoices')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.meta.total).toBeGreaterThan(0);
    });
  });

  describe('Orders & Refunds Management', () => {
    it('should list orders', async () => {
      const response = await request(app.getHttpServer())
        .get('/admin/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toBeInstanceOf(Array);
    });

    it('should process a refund', async () => {
      const response = await request(app.getHttpServer())
        .post('/admin/refunds')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          orderId,
          amount: 1000,
          reason: 'Customer request',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.amount).toBe(1000);
    });
  });

  describe('Subscription Management', () => {
    it('should list subscriptions', async () => {
      const response = await request(app.getHttpServer())
        .get('/admin/subscriptions')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toBeInstanceOf(Array);
    });

    it('should get dunning dashboard', async () => {
      const response = await request(app.getHttpServer())
        .get('/admin/dunning/dashboard')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('stats');
      expect(response.body).toHaveProperty('subscriptions');
    });
  });
});
