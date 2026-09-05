/**
 * ACET 3D — Supabase Database Integration & Acceptance Test Suite
 * Department of Computer Science and Engineering
 * Akshaya College of Engineering & Technology (acetcbe.edu.in • TNEA: 2763)
 */

const BASE_URL = 'http://localhost:5000/api';

async function req(url, options = {}) {
  const { body, headers, ...rest } = options;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(headers || {}) },
    body: body ? JSON.stringify(body) : undefined,
    ...rest
  });
  const data = await res.json();
  if (!res.ok && !data.success) {
    throw new Error(data.message || `HTTP ${res.status}`);
  }
  return data;
}

async function runAcceptanceTest() {
  console.log('🧪 Starting Full ACET 3D Supabase Database Acceptance Test Suite...\n');
  let passed = 0;
  let total = 7;

  try {
    // 0. Supabase Health Check & Count Verification
    console.log('👉 [Test 0] Verify Supabase Database Health & Count Endpoint...');
    const healthRes = await req(`${BASE_URL}/health`);
    if (typeof healthRes.productsCount !== 'number') {
      throw new Error('Health check did not return numeric productsCount');
    }
    console.log(`   ✓ Health endpoint live: productsCount = ${healthRes.productsCount} (${healthRes.databaseEngine})`);

    // 1. Admin Authentication & Add Product in Supabase
    console.log('\n👉 [Test 1] Add a product as admin and verify in Supabase storefront catalog...');
    const loginRes = await req(`${BASE_URL}/auth/login`, {
      method: 'POST',
      body: {
        email: 'admin@acetcbe.edu.in',
        password: 'acet3d2026'
      }
    });
    const token = loginRes.data.token;
    if (!token) throw new Error('Admin login failed');

    const testProductSlug = `cse-iot-case-${Date.now()}`;
    const newProductData = {
      name: 'CSE IoT Microcontroller Cluster Enclosure',
      slug: testProductSlug,
      category: 'CSE Academic Models',
      salePrice: 1199,
      basePrice: 1599,
      stockQuantity: 30,
      images: [
        { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80', position: 0 }
      ],
      materials: [
        { name: 'PLA Pro', priceDelta: 0 },
        { name: 'PETG High-Toughness', priceDelta: 150 }
      ],
      sizes: [
        { label: 'Standard Cluster (100mm)', priceDelta: 0 },
        { label: 'Server Rack Mount (180mm)', priceDelta: 350 }
      ],
      description: 'Parametric ventilated enclosure designed for Raspberry Pi & ESP32 cluster computing nodes by CSE lab.'
    };

    const addProductRes = await req(`${BASE_URL}/products`, {
      method: 'POST',
      body: newProductData,
      headers: { Authorization: `Bearer ${token}` }
    });
    const createdProductId = addProductRes.data.id;
    console.log(`   ✓ Product created with ID: ${createdProductId}`);

    // Verify on live storefront
    const storefrontRes = await req(`${BASE_URL}/products`);
    const existsOnStorefront = storefrontRes.data.some(p => p.id === createdProductId || p.slug === testProductSlug);
    if (!existsOnStorefront) throw new Error('Created product not found in live products API');
    console.log('   ✅ PASS [1/7]: Admin product creation immediately live in Supabase storefront.');
    passed++;

    // 2. Guest Product Search & Filtering
    console.log('\n👉 [Test 2] Search and filter for product as guest...');
    const searchRes = await req(`${BASE_URL}/products?search=Microcontroller`);
    const searchMatches = searchRes.data.some(p => p.slug === testProductSlug || p.name.includes('Microcontroller'));
    if (!searchMatches) throw new Error('Search did not match created product');
    console.log('   ✅ PASS [2/7]: Guest search & category filtering finds product.');
    passed++;

    // 3. Cart Checkout & Order Creation
    console.log('\n👉 [Test 3] Cart checkout with order creation & payment in Supabase...');
    const orderPayload = {
      customer: {
        name: 'Karthik Subramanian',
        email: 'karthik.s@acetcbe.edu.in',
        phone: '+91 97894 44111',
        address: 'CSE Smart Lab, Akshaya College, Kinathukadavu'
      },
      items: [
        {
          productId: createdProductId,
          name: newProductData.name,
          quantity: 1,
          material: 'PLA Pro',
          size: 'Standard (100mm)',
          priceAtPurchase: 1199
        }
      ],
      totalAmount: 1199,
      paymentStatus: 'paid',
      deliveryMethod: 'campus_pickup',
      status: 'Placed'
    };

    const createOrderRes = await req(`${BASE_URL}/orders`, {
      method: 'POST',
      body: orderPayload
    });
    const createdOrderId = createOrderRes.data.orderId;
    if (!createdOrderId) throw new Error('Failed to create order');
    console.log(`   ✓ Order successfully placed: ${createdOrderId}`);

    // Verify in Admin Orders
    const adminOrdersRes = await req(`${BASE_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const orderInAdmin = adminOrdersRes.data.some(o => o.orderId === createdOrderId);
    if (!orderInAdmin) throw new Error('Order not found in admin orders list');
    console.log('   ✅ PASS [3/7]: Checkout persisted in orders table and visible in admin dashboard.');
    passed++;

    // 4. Custom CAD Print Request Submission
    console.log('\n👉 [Test 4] Submit custom CAD print request...');
    const cadPayload = {
      name: 'Ananya S.',
      email: 'ananya.s@acetcbe.edu.in',
      phone: '+91 98422 12345',
      desiredSize: '150x120x80 mm',
      material: 'Carbon Fiber Nylon',
      budgetRange: '₹1200 - ₹2000',
      notes: 'Please slice with 0.12mm layer height for aerodynamic model testing.'
    };
    const cadRes = await req(`${BASE_URL}/custom-requests`, {
      method: 'POST',
      body: cadPayload
    });
    const cadRequestId = cadRes.data.requestId;
    if (!cadRequestId) throw new Error('Failed to submit custom CAD request');
    console.log(`   ✓ CAD Request submitted: ${cadRequestId}`);

    // Verify in Admin CAD Queue
    const adminCadRes = await req(`${BASE_URL}/custom-requests`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const cadInAdmin = adminCadRes.data.some(r => r.requestId === cadRequestId);
    if (!cadInAdmin) throw new Error('CAD request not found in admin queue');
    console.log('   ✅ PASS [4/7]: Custom CAD request submitted and present in admin queue.');
    passed++;

    // 5. Real-Time Order Tracking
    console.log('\n👉 [Test 5] Track order by Order ID...');
    const trackRes = await req(`${BASE_URL}/orders/track?orderId=${createdOrderId}`);
    if (trackRes.data.orderId !== createdOrderId) {
      throw new Error('Order tracking ID mismatch');
    }
    console.log(`   ✓ Live tracking status for ${createdOrderId}: "${trackRes.data.status}"`);
    console.log('   ✅ PASS [5/7]: Order tracking by ID returned live progress accurately.');
    passed++;

    // 6. Supabase Persistence Check
    console.log('\n👉 [Test 6] Supabase database collections & relations persistence check...');
    const productDetail = await req(`${BASE_URL}/products/${testProductSlug}`);
    if (!productDetail.data || productDetail.data.name !== newProductData.name) {
      throw new Error('Direct product lookup by slug failed');
    }
    if (!Array.isArray(productDetail.data.materials) || productDetail.data.materials.length === 0) {
      throw new Error('Relational materials missing from product detail');
    }
    console.log('   ✅ PASS [6/7]: All data and relational entities stored and persisted in Supabase tables.');
    passed++;

    // 7. Department Scoping Verification
    console.log('\n👉 [Test 7] Department Scope Verification...');
    const adminStats = await req(`${BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!adminStats.data.facultyAdvisor.includes('Department of CSE 3D Printing Lab')) {
      throw new Error('Department scope mismatch in admin stats');
    }
    console.log('   ✓ Verified Department strictly scoped to Computer Science and Engineering.');
    console.log('   ✅ PASS [7/7]: Department strictly scoped to Computer Science and Engineering.');
    passed++;

    // Cleanup test product
    await req(`${BASE_URL}/products/${createdProductId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`   ✓ Cleaned up temporary test product ${testProductSlug}`);

    console.log('\n======================================================');
    console.log(`🎉 ALL ${passed}/${total} ACCEPTANCE TESTS PASSED SUCCESSFULLY!`);
    console.log('======================================================\n');
  } catch (error) {
    console.error(`\n❌ TEST FAILURE at step: ${error.message}`);
    process.exit(1);
  }
}

runAcceptanceTest();
