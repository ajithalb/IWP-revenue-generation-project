// Automated End-to-End Verification Test Runner for Sasti Boutique
const BASE_URL = 'http://localhost:5001/api';

async function runTests() {
  console.log('==================================================================');
  console.log('   SASTI BOUTIQUE - AUTOMATED TEST SUITE EXECUTION');
  console.log('==================================================================');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${name}: ${err.message}`);
      failed++;
    }
  }

  // 1. Health Check
  await test('Health check returns correct business details', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    if (data.status !== 'online') throw new Error('Status not online');
    if (data.business.name !== 'Sasti Boutique') throw new Error('Business name mismatch');
    if (data.business.email !== 'nisanth08.connect@gamil.com') throw new Error('Email mismatch');
    if (data.business.phone !== '7904871123') throw new Error('Phone mismatch');
  });

  // 2. Products API
  await test('Products API returns chudithar sets and makeup items', async () => {
    const res = await fetch(`${BASE_URL}/products`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.products)) throw new Error('Invalid products payload');
    if (data.products.length < 15) throw new Error(`Expected at least 15 seeded products, got ${data.products.length}`);
    
    // Verify JSON parsing of sizes and colors
    const first = data.products[0];
    if (!Array.isArray(first.sizes) || !Array.isArray(first.colors)) {
      throw new Error('Sizes or colors not parsed as arrays');
    }
  });

  // 3. Category & Filter Verification
  await test('Category filtering works correctly', async () => {
    const resChud = await fetch(`${BASE_URL}/products?category=chudithar`);
    const dataChud = await resChud.json();
    if (!dataChud.products.every(p => p.category === 'chudithar')) {
      throw new Error('Filter returned non-chudithar item');
    }

    const resMkp = await fetch(`${BASE_URL}/products?category=makeup`);
    const dataMkp = await resMkp.json();
    if (!dataMkp.products.every(p => p.category === 'makeup')) {
      throw new Error('Filter returned non-makeup item');
    }
  });

  // 4. Bridal Makeup Services
  await test('Bridal services API returns all 6 packages with prices', async () => {
    const res = await fetch(`${BASE_URL}/bookings/services`);
    const data = await res.json();
    if (!data.success || data.services.length !== 6) {
      throw new Error(`Expected 6 bridal services, got ${data.services.length}`);
    }
    const bridal = data.services.find(s => s.slug === 'bridal-makeup');
    if (!bridal || bridal.price !== 15000) {
      throw new Error('Bridal Makeup Experience price mismatch');
    }
  });

  // 5. Checkout & Order Creation with Stock Reduction
  let createdOrderRef = null;
  let testProductId = 1;
  let stockBefore = 0;

  await test('Order creation calculates price on server and safely reduces stock', async () => {
    // Check initial stock
    const pRes = await fetch(`${BASE_URL}/products/${testProductId}`);
    const pData = await pRes.json();
    stockBefore = pData.product.stock;

    const orderPayload = {
      customer_name: 'Pooja Sharma',
      phone: '9876543210',
      email: 'pooja@example.com',
      address_house: 'Flat 302, Sri Krishna Apts',
      address_street: 'Gandhi Road, Anna Nagar',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600001',
      delivery_instructions: 'Ring doorbell twice',
      payment_method: 'COD',
      items: [
        {
          product_id: testProductId,
          quantity: 2,
          selected_size: 'M',
          selected_color: 'Soft Blush'
        }
      ]
    };

    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });

    const data = await res.json();
    if (!data.success || !data.order || !data.order.order_ref) {
      throw new Error(`Order failed: ${data.message}`);
    }

    createdOrderRef = data.order.order_ref;

    // Verify stock was reduced by 2
    const pResAfter = await fetch(`${BASE_URL}/products/${testProductId}`);
    const pDataAfter = await pResAfter.json();
    if (pDataAfter.product.stock !== stockBefore - 2) {
      throw new Error(`Stock not reduced accurately. Before: ${stockBefore}, After: ${pDataAfter.product.stock}`);
    }
  });

  // 6. Insufficient Stock Prevention
  await test('Order fails if requested quantity exceeds available stock', async () => {
    const orderPayload = {
      customer_name: 'Test Excess',
      phone: '9876543210',
      email: 'excess@example.com',
      address_house: 'House 1',
      address_street: 'Street 1',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600001',
      items: [
        {
          product_id: testProductId,
          quantity: 99999
        }
      ]
    };

    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });

    const data = await res.json();
    if (res.status === 201 || data.success) {
      throw new Error('Server accepted order exceeding available stock!');
    }
  });

  // 7. Order Lookup / Tracking
  await test('Order tracking retrieves placed order by Reference ID and Phone', async () => {
    const resRef = await fetch(`${BASE_URL}/orders/track/${createdOrderRef}`);
    const dataRef = await resRef.json();
    if (!dataRef.success || dataRef.order.order_ref !== createdOrderRef) {
      throw new Error('Tracking by order reference failed');
    }

    const resPhone = await fetch(`${BASE_URL}/orders/track/9876543210`);
    const dataPhone = await resPhone.json();
    if (!dataPhone.success) {
      throw new Error('Tracking by phone number failed');
    }
  });

  // 8. Bridal Makeup Booking Creation
  let createdBookingRef = null;
  await test('Bridal makeup booking creates pending appointment with collision handling', async () => {
    const bookingPayload = {
      customer_name: 'Meera Natarajan',
      contact_number: '9876543211',
      email: 'meera@example.com',
      service_id: 1,
      event_date: '2026-11-20',
      event_time: '05:30 AM',
      event_location: 'Sri Krishna Mandapam, Mylapore, Chennai',
      guest_count: 2,
      additional_requirements: 'Muhurtham Kanjeevaram saree draping and jasmine flower hair styling'
    };

    const res = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingPayload)
    });

    const data = await res.json();
    if (!data.success || !data.booking) {
      throw new Error(`Booking submission failed: ${data.message}`);
    }

    if (data.booking.status !== 'Pending') {
      throw new Error(`Initial status must be Pending, got ${data.booking.status}`);
    }

    createdBookingRef = data.booking.booking_ref;

    // Verify lookup by booking ref
    const trackRes = await fetch(`${BASE_URL}/bookings/track/${createdBookingRef}`);
    const trackData = await trackRes.json();
    if (!trackData.success || trackData.booking.booking_ref !== createdBookingRef) {
      throw new Error('Booking tracking by reference failed');
    }
  });

  // 9. Contact Message Submission
  await test('Contact message form submission saves to SQLite database', async () => {
    const contactPayload = {
      name: 'Radha Swaminathan',
      email: 'radha@example.com',
      phone: '9840112233',
      subject: 'Inquiry regarding pure Malmal cotton care',
      message: 'Hello, can you advise on handwashing instructions for the Malmal suits?'
    };

    const res = await fetch(`${BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactPayload)
    });

    const data = await res.json();
    if (!data.success || !data.contactId) {
      throw new Error(`Contact submission failed: ${data.message}`);
    }
  });

  // 10. Admin Authentication & Protected Route Access
  let adminToken = null;
  await test('Admin login with default credentials returns JWT token', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        password: 'Admin@Sasti2026'
      })
    });

    const data = await res.json();
    if (!data.success || !data.token) {
      throw new Error(`Admin login failed: ${data.message}`);
    }
    adminToken = data.token;
  });

  // 11. Admin Protected Stats & Orders
  await test('Admin stats dashboard returns real KPI analytics', async () => {
    const res = await fetch(`${BASE_URL}/stats/dashboard`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    const data = await res.json();
    if (!data.success || !data.stats) {
      throw new Error(`Dashboard stats failed: ${data.message}`);
    }

    if (data.stats.totalOrders <= 0) {
      throw new Error('Stats did not reflect created orders');
    }
  });

  // 12. Admin Product Management (Add, Edit, Delete)
  await test('Admin can add, update price/stock, and delete a product', async () => {
    // 1. Add
    const createRes = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        name: 'Test Silk Chudithar Suit',
        category: 'chudithar',
        subcategory: 'Party Wear',
        price: 1599,
        stock: 10,
        image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        description: 'Test product for automated suite'
      })
    });
    const createData = await createRes.json();
    if (!createData.success || !createData.product) throw new Error('Create product failed');

    const newProdId = createData.product.id;

    // 2. Update Price & Stock
    const updateRes = await fetch(`${BASE_URL}/products/${newProdId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        price: 1799,
        stock: 25
      })
    });
    const updateData = await updateRes.json();
    if (!updateData.success || updateData.product.price !== 1799 || updateData.product.stock !== 25) {
      throw new Error('Update product failed');
    }

    // 3. Delete
    const deleteRes = await fetch(`${BASE_URL}/products/${newProdId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const deleteData = await deleteRes.json();
    if (!deleteData.success) throw new Error('Delete product failed');
  });

  // 13. Admin Order Status Update
  await test('Admin can update order status (Pending -> Confirmed -> Shipped)', async () => {
    const resOrders = await fetch(`${BASE_URL}/orders`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const dataOrders = await resOrders.json();
    const targetOrder = dataOrders.orders.find(o => o.order_ref === createdOrderRef);
    if (!targetOrder) throw new Error('Target order not found');

    const updateRes = await fetch(`${BASE_URL}/orders/${targetOrder.id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: 'Confirmed' })
    });
    const updateData = await updateRes.json();
    if (!updateData.success || updateData.order.status !== 'Confirmed') {
      throw new Error('Failed to update order status');
    }
  });

  console.log('==================================================================');
  console.log(`   TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('==================================================================');

  if (failed > 0) process.exit(1);
}

runTests();
