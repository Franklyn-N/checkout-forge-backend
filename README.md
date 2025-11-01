# CheckoutForge Backend

Production-ready NestJS backend for a multi-tenant SaaS checkout platform with Stripe integration.

## Features

- **Multi-tenant Architecture**: Complete tenant isolation at database level
- **JWT Authentication**: Role-based access control (OWNER, ADMIN, FINANCE, SUPPORT)
- **Stripe Integration**: Payment intents, checkout sessions, subscriptions, webhooks
- **Product Management**: Products, prices, checkout pages, order bumps, upsells
- **Order Processing**: Full order lifecycle with refunds support
- **Subscription Management**: Recurring billing with Stripe subscriptions
- **VAT Reporting**: Comprehensive VAT reports for UK compliance
- **GDPR Compliance**: Data export and anonymization endpoints
- **Webhook Processing**: Robust Stripe webhook handling with idempotency
- **OpenAPI Documentation**: Auto-generated API docs with Swagger

## Tech Stack

- **Runtime**: Node.js LTS
- **Framework**: NestJS 10.x
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with Passport
- **Payments**: Stripe API
- **Testing**: Jest
- **Documentation**: Swagger/OpenAPI 3.0

## Prerequisites

- Node.js 18+ (LTS)
- PostgreSQL 14+
- npm or pnpm
- Stripe account (test keys for development)

## Installation

```bash
# Install dependencies
npm install

# or using pnpm
pnpm install
```

## Configuration

Copy `.env.example` to `.env` and configure:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/checkoutforge

# JWT
JWT_SECRET=your-secure-random-jwt-secret-key
JWT_EXPIRATION=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_your_test_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Application
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
```

## Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Or for development (creates migration)
npm run db:migrate:dev

# Open Prisma Studio (database GUI)
npm run db:studio
```

## Running the Application

```bash
# Development mode (with watch)
npm run start:dev

# Production mode
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

The API will be available at `http://localhost:3000/api/v1`

API Documentation: `http://localhost:3000/api/docs`

## API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/login` - Login user

### Products
- `POST /api/v1/products` - Create product (OWNER, ADMIN)
- `GET /api/v1/products/:id` - Get product
- `GET /api/v1/products` - List products
- `POST /api/v1/products/:id/prices` - Create price

### Checkouts
- `GET /api/v1/checkouts/:slug` - Get checkout page
- `POST /api/v1/checkout/:checkoutId/session` - Create checkout session

### Orders
- `GET /api/v1/orders/:id` - Get order
- `GET /api/v1/orders` - List orders
- `POST /api/v1/orders/:id/refund` - Refund order (OWNER, ADMIN, FINANCE)

### Subscriptions
- `GET /api/v1/subscriptions` - List subscriptions
- `GET /api/v1/subscriptions/:id` - Get subscription
- `POST /api/v1/subscriptions/:id/cancel` - Cancel subscription (OWNER, ADMIN, FINANCE)

### Reports
- `GET /api/v1/reports/vat?from=2025-01-01&to=2025-12-31` - VAT report (OWNER, ADMIN, FINANCE)

### GDPR
- `GET /api/v1/gdpr/export?customer_id=xxx` - Export customer data (OWNER, ADMIN)
- `POST /api/v1/gdpr/delete?customer_id=xxx` - Delete/anonymize customer data (OWNER, ADMIN)

### Webhooks
- `POST /api/v1/webhooks/stripe` - Stripe webhook handler (public endpoint)

## Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e
```

## Stripe Webhook Setup

### Local Development

Use Stripe CLI to forward webhooks:

```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/v1/webhooks/stripe

# Copy the webhook signing secret to your .env file
# STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### Production

1. Create webhook endpoint in Stripe Dashboard
2. Set endpoint URL: `https://your-domain.com/api/v1/webhooks/stripe`
3. Select events to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `charge.refunded`
4. Copy webhook signing secret to production env

## Example cURL Requests

### Create Checkout Session

```bash
# First, login to get JWT token
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123",
    "tenantId": "demo-tenant"
  }'

# Use the returned token in subsequent requests
curl -X POST http://localhost:3000/api/v1/checkout/CHECKOUT_ID/session \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "priceId": "price-uuid",
    "customerEmail": "customer@example.com",
    "customerName": "John Doe",
    "quantity": 1,
    "applyVat": true
  }'

# Response includes clientSecret for Stripe Elements
{
  "clientSecret": "pi_xxx_secret_xxx",
  "orderId": "order-uuid",
  "orderNumber": "ORD-123456",
  "total": 11880,
  "currency": "GBP"
}
```

## Project Structure

```
backend/
├── src/
│   ├── auth/              # Authentication & authorization
│   ├── products/          # Product management
│   ├── checkouts/         # Checkout & Stripe integration
│   ├── orders/            # Order management
│   ├── subscriptions/     # Subscription handling
│   ├── reports/           # Reporting & analytics
│   ├── gdpr/              # GDPR compliance
│   ├── webhooks/          # Webhook handlers
│   ├── prisma/            # Prisma service
│   ├── common/            # Shared guards, decorators, etc.
│   ├── app.module.ts      # Root module
│   └── main.ts            # Application entry point
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── migrations/        # Database migrations
├── test/                  # E2E tests
├── package.json
├── tsconfig.json
└── nest-cli.json
```

## Database Schema

The application uses the following core tables:

- `tenants` - Multi-tenant organization data
- `user_accounts` - User authentication & RBAC
- `products` - Product catalog
- `prices` - Product pricing (one-time/recurring)
- `checkout_pages` - Customizable checkout pages
- `customers` - Customer records
- `orders` - Order processing
- `order_items` - Order line items
- `subscriptions` - Recurring subscriptions
- `refunds` - Refund tracking
- `affiliates` - Affiliate program
- `webhook_events` - Webhook event log

## Security Features

- **JWT Authentication**: Secure token-based auth
- **Role-Based Access Control**: OWNER, ADMIN, FINANCE, SUPPORT roles
- **Tenant Isolation**: Data completely isolated per tenant
- **Stripe Webhook Verification**: Signature verification on all webhooks
- **Idempotency**: Webhook deduplication
- **Rate Limiting**: API throttling (100 req/min)
- **CORS Protection**: Configured for frontend origin

## License

Proprietary
