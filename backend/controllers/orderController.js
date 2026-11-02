const db = require('../database/db');

function generateOrderRef() {
  const date = new Date();
  const yearMonth = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `SB-ORD-${yearMonth}-${randomSuffix}`;
}

function createOrder(req, res) {
  try {
    const {
      customer_name,
      phone,
      email,
      address_house,
      address_street,
      city,
      state,
      pincode,
      delivery_instructions,
      payment_method = 'COD',
      items = []
    } = req.body;

    // 1. Validate required fields
    if (
      !customer_name ||
      !phone ||
      !email ||
      !address_house ||
      !address_street ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required delivery address fields.'
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty. Please add products before checking out.'
      });
    }

    // Basic phone validation (10 digits)
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit phone number.'
      });
    }

    // 2. Server-side validation of stock & prices
    let calculatedSubtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const prodId = Number(item.product_id || item.id);
      const qty = parseInt(item.quantity, 10);

      if (!prodId || isNaN(qty) || qty <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid item or quantity in your order.'
        });
      }

      const product = db.prepare('SELECT id, name, price, stock, image_url FROM products WHERE id = ?').get(prodId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${prodId} no longer exists in our catalog.`
        });
      }

      if (product.stock < qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${qty}.`
        });
      }

      const itemSubtotal = product.price * qty;
      calculatedSubtotal += itemSubtotal;

      validatedItems.push({
        product_id: product.id,
        product_name: product.name,
        price: product.price,
        quantity: qty,
        selected_size: item.selected_size || 'Standard',
        selected_color: item.selected_color || 'Default',
        image_url: item.image_url || product.image_url,
        subtotal: itemSubtotal
      });
    }

    // 3. Delivery fee: Free for orders >= ₹999, else ₹70
    const deliveryFee = calculatedSubtotal >= 999 ? 0 : 70;
    const discountAmount = 0;
    const totalAmount = calculatedSubtotal + deliveryFee - discountAmount;
    const orderRef = generateOrderRef();

    const paymentStatus = payment_method === 'MOCK_ONLINE' ? 'Paid (Mock Testing)' : 'Pending (Cash on Delivery)';

    // 4. Atomic transaction to insert order and deduct stock
    const executeOrderTransaction = db.transaction(() => {
      // Insert Order
      const insertOrderStmt = db.prepare(`
        INSERT INTO orders (
          order_ref, customer_name, phone, email,
          address_house, address_street, city, state, pincode,
          delivery_instructions, payment_method, payment_status,
          subtotal, delivery_fee, discount_amount, total_amount, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
      `);

      const orderResult = insertOrderStmt.run(
        orderRef,
        customer_name.trim(),
        cleanPhone,
        email.trim(),
        address_house.trim(),
        address_street.trim(),
        city.trim(),
        state.trim(),
        pincode.trim(),
        delivery_instructions ? delivery_instructions.trim() : '',
        payment_method,
        paymentStatus,
        calculatedSubtotal,
        deliveryFee,
        discountAmount,
        totalAmount
      );

      const orderId = orderResult.lastInsertRowid;

      // Insert Order Items and Decrement Stock
      const insertItemStmt = db.prepare(`
        INSERT INTO order_items (
          order_id, product_id, product_name, price, quantity,
          selected_size, selected_color, image_url, subtotal
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const decrementStockStmt = db.prepare(`
        UPDATE products SET stock = stock - ? WHERE id = ?
      `);

      for (const vItem of validatedItems) {
        insertItemStmt.run(
          orderId,
          vItem.product_id,
          vItem.product_name,
          vItem.price,
          vItem.quantity,
          vItem.selected_size,
          vItem.selected_color,
          vItem.image_url,
          vItem.subtotal
        );

        decrementStockStmt.run(vItem.quantity, vItem.product_id);
      }

      return orderId;
    });

    const newOrderId = executeOrderTransaction();

    // Fetch the created order with its items
    const savedOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(newOrderId);
    const savedItems = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(newOrderId);

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully! We will prepare your boutique package shortly.',
      order: {
        ...savedOrder,
        items: savedItems
      }
    });
  } catch (err) {
    console.error('[Order Controller] Create Order Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to process order: ' + err.message
    });
  }
}

function getOrderDetails(req, res) {
  try {
    const { identifier } = req.params; // Can be order_ref or phone number
    const term = identifier.trim();

    const order = db.prepare('SELECT * FROM orders WHERE order_ref = ? OR id = ?').get(term, term);

    if (!order) {
      // Try searching by phone
      const ordersByPhone = db.prepare('SELECT * FROM orders WHERE phone = ? ORDER BY created_at DESC').all(term);
      if (ordersByPhone.length > 0) {
        const enrichedOrders = ordersByPhone.map(ord => {
          const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(ord.id);
          return { ...ord, items };
        });
        return res.json({
          success: true,
          multiple: true,
          orders: enrichedOrders
        });
      }

      return res.status(404).json({
        success: false,
        message: `No order found with reference or phone "${identifier}". Please check your order details.`
      });
    }

    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);

    return res.json({
      success: true,
      multiple: false,
      order: {
        ...order,
        items
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

function getAllOrders(req, res) {
  try {
    const { status, search } = req.query;
    let query = 'SELECT * FROM orders WHERE 1=1';
    const params = [];

    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      query += ' AND (order_ref LIKE ? OR customer_name LIKE ? OR phone LIKE ? OR city LIKE ?)';
      params.push(term, term, term, term);
    }

    query += ' ORDER BY created_at DESC';

    const orders = db.prepare(query).all(...params);

    const enrichedOrders = orders.map(ord => {
      const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(ord.id);
      return { ...ord, items };
    });

    return res.json({
      success: true,
      count: enrichedOrders.length,
      orders: enrichedOrders
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowed.join(', ')}`
      });
    }

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // If order was cancelled and previous status was not cancelled, return stock
    if (status === 'Cancelled' && order.status !== 'Cancelled') {
      const items = db.prepare('SELECT product_id, quantity FROM order_items WHERE order_id = ?').all(id);
      const restockStmt = db.prepare('UPDATE products SET stock = stock + ? WHERE id = ?');
      for (const item of items) {
        restockStmt.run(item.quantity, item.product_id);
      }
    }

    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);

    const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(id);

    return res.json({
      success: true,
      message: `Order status updated to "${status}".`,
      order: { ...updated, items }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  createOrder,
  getOrderDetails,
  getAllOrders,
  updateOrderStatus
};
