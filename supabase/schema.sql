-- ============================================================================
-- ACET 3D — Official Supabase PostgreSQL Database Schema
-- Department of Computer Science and Engineering
-- Akshaya College of Engineering & Technology (acetcbe.edu.in • TNEA: 2763)
-- ============================================================================

-- Enable pgcrypto / uuid-ossp for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. USERS & ROLES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.app_users (
  uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  password_hash TEXT,
  role TEXT NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 1b. ADMINS / STAFF
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.app_admins (
  admin_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  department TEXT DEFAULT 'Department of Computer Science and Engineering',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. ADDRESSES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.app_users(uid) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  street_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. PRODUCTS & RELATIONS (§2 Schema Specification)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- 'Figurines & Collectibles' | 'Home & Desk Décor' | 'CSE Academic Models' | 'Keychains & Small Gifts' | 'Custom Prints' | 'Event & Fest Merchandise'
  base_price NUMERIC(10, 2) NOT NULL,
  sale_price NUMERIC(10, 2),
  stock_quantity INTEGER NOT NULL DEFAULT 25,
  print_time_hours NUMERIC(6, 2) DEFAULT 2.0,
  weight_grams NUMERIC(6, 2) DEFAULT 50.0,
  care_instructions TEXT DEFAULT 'Keep away from direct heat exceeding 55°C.',
  rating_avg NUMERIC(3, 2) DEFAULT 0.0,
  rating_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- One product can have many images
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- One product can have many material options, each with its own price delta
CREATE TABLE IF NOT EXISTS public.product_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g. 'PLA', 'Resin', 'PETG'
  price_delta NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- One product can have many size options, each with its own price delta
CREATE TABLE IF NOT EXISTS public.product_sizes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  label TEXT NOT NULL, -- e.g. 'Small (5cm)', 'Executive Pedestal (18cm)'
  price_delta NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. ORDERS & FULFILLMENT
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customer_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  buyer_uid UUID REFERENCES public.app_users(uid) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Placed', -- 'Placed' | 'Confirmed' | 'Printing' | 'Shipped' | 'Ready for Pickup' | 'Delivered'
  total_amount NUMERIC(10, 2) NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'paid', -- 'pending' | 'paid' | 'failed'
  payment_id TEXT,
  delivery_method TEXT NOT NULL DEFAULT 'campus_pickup', -- 'shipping' | 'campus_pickup'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.customer_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name_snapshot TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  material TEXT,
  size TEXT,
  price_at_purchase NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.customer_orders(id) ON DELETE CASCADE,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  method TEXT NOT NULL DEFAULT 'Razorpay',
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'paid',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.customer_orders(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
  amount NUMERIC(10, 2) NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.customer_orders(id) ON DELETE CASCADE,
  tracking_number TEXT,
  carrier TEXT,
  shipped_at TIMESTAMPTZ,
  estimated_delivery TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.customer_orders(id) ON DELETE CASCADE,
  from_status TEXT,
  status TEXT NOT NULL,
  note TEXT,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.return_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.customer_orders(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'requested',
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. CUSTOM CAD PRINT REQUESTS & REVIEWS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.custom_print_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_uid UUID REFERENCES public.app_users(uid) ON DELETE SET NULL,
  request_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  file_url TEXT,
  reference_image_url TEXT,
  desired_size TEXT DEFAULT 'Standard (100mm)',
  material TEXT DEFAULT 'PLA Pro',
  infill_percent INTEGER,
  color TEXT,
  quoted_price NUMERIC(10,2),
  budget_range TEXT DEFAULT '₹500 - ₹1500',
  deadline TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'new', -- 'new' | 'reviewing' | 'quoted' | 'accepted' | 'rejected'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  rating NUMERIC(2, 1) NOT NULL DEFAULT 5.0,
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 6. CARTS & WISHLISTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.app_users(uid) ON DELETE CASCADE,
  session_id TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  material TEXT,
  size TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.app_users(uid) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 7. INDEXES FOR PERFORMANCE
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_materials_product_id ON public.product_materials(product_id);
CREATE INDEX IF NOT EXISTS idx_product_sizes_product_id ON public.product_sizes(product_id);
CREATE INDEX IF NOT EXISTS idx_customer_orders_order_number ON public.customer_orders(order_number);
CREATE INDEX IF NOT EXISTS idx_customer_orders_created_at ON public.customer_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_custom_print_requests_request_id ON public.custom_print_requests(request_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);

-- ----------------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_print_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Public read access for active products and catalog items
CREATE POLICY "Public products are viewable by everyone" ON public.products
  FOR SELECT USING (is_active = true OR auth.role() = 'service_role');

CREATE POLICY "Public product images are viewable by everyone" ON public.product_images
  FOR SELECT USING (true);

CREATE POLICY "Public product materials are viewable by everyone" ON public.product_materials
  FOR SELECT USING (true);

CREATE POLICY "Public product sizes are viewable by everyone" ON public.product_sizes
  FOR SELECT USING (true);

CREATE POLICY "Public reviews are viewable by everyone" ON public.reviews
  FOR SELECT USING (true);

-- Anyone can insert orders and custom requests (guest checkout support)
CREATE POLICY "Anyone can create orders" ON public.customer_orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can create order items" ON public.order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can create custom requests" ON public.custom_print_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (true);

-- Service role has full unrestricted access for backend operations
CREATE POLICY "Service role full access on products" ON public.products
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on product_images" ON public.product_images
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on product_materials" ON public.product_materials
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on product_sizes" ON public.product_sizes
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on orders" ON public.customer_orders
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on order_items" ON public.order_items
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on custom_requests" ON public.custom_print_requests
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on reviews" ON public.reviews
  FOR ALL USING (auth.role() = 'service_role');
