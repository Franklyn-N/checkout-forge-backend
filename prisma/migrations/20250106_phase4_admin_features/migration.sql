/*
  # Phase 4: Admin & Merchant Features Migration

  ## Overview
  This migration adds comprehensive admin features, A/B testing, analytics tracking,
  enhanced affiliate management, page templates, and invoice generation capabilities.

  ## New Tables

  ### 1. `ab_tests`
  A/B testing experiments for checkout pages
  - `id` (uuid, primary key)
  - `tenant_id` (uuid, foreign key → tenants)
  - `name` (text) - Test name
  - `description` (text, nullable) - Test description
  - `status` (ABTestStatus enum) - DRAFT, RUNNING, PAUSED, COMPLETED
  - `traffic_split` (integer) - Percentage split (default 50)
  - `started_at` (timestamp, nullable)
  - `ended_at` (timestamp, nullable)
  - `winner_variant_id` (uuid, nullable)
  - `created_at`, `updated_at` (timestamps)

  ### 2. `ab_test_variants`
  Variants within A/B tests
  - `id` (uuid, primary key)
  - `ab_test_id` (uuid, foreign key → ab_tests)
  - `checkout_page_id` (uuid, foreign key → checkout_pages)
  - `name` (text) - Variant name
  - `is_control` (boolean) - Whether this is the control variant
  - `views` (integer) - View count
  - `conversions` (integer) - Conversion count
  - `revenue` (integer) - Total revenue in pence
  - `created_at`, `updated_at` (timestamps)

  ### 3. `ab_test_assignments`
  Tracks user assignments to A/B test variants
  - `id` (uuid, primary key)
  - `ab_test_id` (uuid, foreign key → ab_tests)
  - `variant_id` (uuid, foreign key → ab_test_variants)
  - `order_id` (uuid, unique, foreign key → orders)
  - `session_id` (text, nullable)
  - `created_at` (timestamp)

  ### 4. `analytics_events`
  Tracks analytics events for funnel analysis
  - `id` (uuid, primary key)
  - `tenant_id` (uuid)
  - `event_type` (text) - Event type (page_view, add_to_cart, checkout_start, etc.)
  - `order_id` (uuid, nullable, foreign key → orders)
  - `session_id` (text, nullable)
  - `page_url` (text, nullable)
  - `metadata` (jsonb, nullable)
  - `created_at` (timestamp)

  ### 5. `page_templates`
  Reusable checkout page templates with block editor support
  - `id` (uuid, primary key)
  - `tenant_id` (uuid, foreign key → tenants)
  - `name` (text) - Template name
  - `description` (text, nullable)
  - `thumbnail` (text, nullable) - Preview image URL
  - `blocks` (jsonb) - Block editor structure
  - `default_settings` (jsonb, nullable)
  - `is_public` (boolean) - Whether template is publicly available
  - `created_at`, `updated_at` (timestamps)

  ### 6. `invoices`
  Generated invoices for orders
  - `id` (uuid, primary key)
  - `tenant_id` (uuid, foreign key → tenants)
  - `order_id` (uuid, unique, foreign key → orders)
  - `invoice_number` (text, unique) - Human-readable invoice number
  - `pdf_url` (text, nullable) - S3/storage URL for PDF
  - `issued_at` (timestamp)
  - `due_at` (timestamp, nullable)
  - `created_at` (timestamp)

  ### 7. `affiliate_clicks`
  Tracks affiliate link clicks for attribution
  - `id` (uuid, primary key)
  - `affiliate_id` (uuid, foreign key → affiliates)
  - `tenant_id` (uuid)
  - `ip` (text, nullable)
  - `user_agent` (text, nullable)
  - `referrer` (text, nullable)
  - `landing_page` (text, nullable)
  - `converted` (boolean) - Whether click resulted in conversion
  - `order_id` (text, nullable)
  - `created_at` (timestamp)

  ## Modified Tables

  ### `checkout_pages`
  - Added `template_id` (uuid, nullable, foreign key → page_templates)
  - Added `blocks` (jsonb, nullable) - Custom block editor structure

  ### `affiliates`
  - Added `status` (AffiliateStatus enum) - PENDING, APPROVED, REJECTED, SUSPENDED
  - Added `total_clicks` (integer) - Total click count
  - Added `total_conversions` (integer) - Total conversion count
  - Added `approved_by` (text, nullable) - User who approved
  - Added `approved_at` (timestamp, nullable)
  - Changed `commission_rate` type handling

  ### `affiliate_commissions`
  - Changed `status` from text to CommissionStatus enum (PENDING, APPROVED, PAID, CANCELLED)
  - Added `note` (text, nullable)

  ## New Enums

  ### `AffiliateStatus`
  - PENDING - Awaiting approval
  - APPROVED - Active affiliate
  - REJECTED - Application rejected
  - SUSPENDED - Temporarily suspended

  ### `ABTestStatus`
  - DRAFT - Test being configured
  - RUNNING - Test active
  - PAUSED - Temporarily paused
  - COMPLETED - Test finished

  ### `CommissionStatus`
  - PENDING - Commission calculated but not approved
  - APPROVED - Approved for payout
  - PAID - Commission paid out
  - CANCELLED - Commission cancelled

  ## Indexes

  - `affiliate_clicks(affiliate_id, created_at)` - For affiliate dashboard queries
  - `analytics_events(tenant_id, event_type, created_at)` - For analytics queries
  - `analytics_events(session_id)` - For funnel tracking
  - `ab_test_assignments(ab_test_id, variant_id)` - For A/B test results

  ## Security

  All new tables will have RLS (Row Level Security) enabled in subsequent migrations.
  Access control will be enforced through tenant_id foreign key constraints.
*/

-- Create new enums
CREATE TYPE "AffiliateStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');
CREATE TYPE "ABTestStatus" AS ENUM ('DRAFT', 'RUNNING', 'PAUSED', 'COMPLETED');
CREATE TYPE "CommissionStatus" AS ENUM ('PENDING', 'APPROVED', 'PAID', 'CANCELLED');

-- Create page_templates table
CREATE TABLE IF NOT EXISTS "page_templates" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "tenant_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "thumbnail" TEXT,
    "blocks" JSONB NOT NULL,
    "default_settings" JSONB,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "page_templates_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Add new columns to checkout_pages
ALTER TABLE "checkout_pages" ADD COLUMN IF NOT EXISTS "template_id" TEXT;
ALTER TABLE "checkout_pages" ADD COLUMN IF NOT EXISTS "blocks" JSONB;
ALTER TABLE "checkout_pages" ADD CONSTRAINT "checkout_pages_template_id_fkey"
    FOREIGN KEY ("template_id") REFERENCES "page_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Modify affiliates table
ALTER TABLE "affiliates" ADD COLUMN IF NOT EXISTS "status" "AffiliateStatus" NOT NULL DEFAULT 'PENDING';
ALTER TABLE "affiliates" ADD COLUMN IF NOT EXISTS "total_clicks" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "affiliates" ADD COLUMN IF NOT EXISTS "total_conversions" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "affiliates" ADD COLUMN IF NOT EXISTS "approved_by" TEXT;
ALTER TABLE "affiliates" ADD COLUMN IF NOT EXISTS "approved_at" TIMESTAMP(3);

-- Create affiliate_clicks table
CREATE TABLE IF NOT EXISTS "affiliate_clicks" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "affiliate_id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "ip" TEXT,
    "user_agent" TEXT,
    "referrer" TEXT,
    "landing_page" TEXT,
    "converted" BOOLEAN NOT NULL DEFAULT false,
    "order_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "affiliate_clicks_affiliate_id_fkey" FOREIGN KEY ("affiliate_id") REFERENCES "affiliates"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "affiliate_clicks_affiliate_id_created_at_idx" ON "affiliate_clicks"("affiliate_id", "created_at");

-- Modify affiliate_commissions table
ALTER TABLE "affiliate_commissions" ADD COLUMN IF NOT EXISTS "status_new" "CommissionStatus" NOT NULL DEFAULT 'PENDING';
UPDATE "affiliate_commissions" SET "status_new" =
    CASE
        WHEN "status" = 'pending' THEN 'PENDING'::"CommissionStatus"
        WHEN "status" = 'approved' THEN 'APPROVED'::"CommissionStatus"
        WHEN "status" = 'paid' THEN 'PAID'::"CommissionStatus"
        ELSE 'PENDING'::"CommissionStatus"
    END;
ALTER TABLE "affiliate_commissions" DROP COLUMN IF EXISTS "status";
ALTER TABLE "affiliate_commissions" RENAME COLUMN "status_new" TO "status";
ALTER TABLE "affiliate_commissions" ADD COLUMN IF NOT EXISTS "note" TEXT;

-- Create ab_tests table
CREATE TABLE IF NOT EXISTS "ab_tests" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "tenant_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ABTestStatus" NOT NULL DEFAULT 'DRAFT',
    "traffic_split" INTEGER NOT NULL DEFAULT 50,
    "started_at" TIMESTAMP(3),
    "ended_at" TIMESTAMP(3),
    "winner_variant_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ab_tests_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create ab_test_variants table
CREATE TABLE IF NOT EXISTS "ab_test_variants" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "ab_test_id" TEXT NOT NULL,
    "checkout_page_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_control" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "revenue" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ab_test_variants_ab_test_id_fkey" FOREIGN KEY ("ab_test_id") REFERENCES "ab_tests"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ab_test_variants_checkout_page_id_fkey" FOREIGN KEY ("checkout_page_id") REFERENCES "checkout_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create ab_test_assignments table
CREATE TABLE IF NOT EXISTS "ab_test_assignments" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "ab_test_id" TEXT NOT NULL,
    "variant_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL UNIQUE,
    "session_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ab_test_assignments_ab_test_id_fkey" FOREIGN KEY ("ab_test_id") REFERENCES "ab_tests"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ab_test_assignments_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "ab_test_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ab_test_assignments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "ab_test_assignments_ab_test_id_variant_id_idx" ON "ab_test_assignments"("ab_test_id", "variant_id");

-- Create analytics_events table
CREATE TABLE IF NOT EXISTS "analytics_events" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "tenant_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "order_id" TEXT,
    "session_id" TEXT,
    "page_url" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "analytics_events_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "analytics_events_tenant_id_event_type_created_at_idx" ON "analytics_events"("tenant_id", "event_type", "created_at");
CREATE INDEX IF NOT EXISTS "analytics_events_session_id_idx" ON "analytics_events"("session_id");

-- Create invoices table
CREATE TABLE IF NOT EXISTS "invoices" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "tenant_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL UNIQUE,
    "invoice_number" TEXT NOT NULL UNIQUE,
    "pdf_url" TEXT,
    "issued_at" TIMESTAMP(3) NOT NULL,
    "due_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "invoices_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "invoices_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
