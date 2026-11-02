const db = require('../database/db');

function getDashboardStats(req, res) {
  try {
    // 1. Order stats
    const orderStats = db.prepare(`
      SELECT 
        COUNT(*) as total_orders,
        COALESCE(SUM(CASE WHEN status != 'Cancelled' THEN total_amount ELSE 0 END), 0) as total_revenue,
        COALESCE(SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END), 0) as pending_orders,
        COALESCE(SUM(CASE WHEN status = 'Delivered' THEN 1 ELSE 0 END), 0) as delivered_orders
      FROM orders
    `).get();

    // 2. Booking stats
    const bookingStats = db.prepare(`
      SELECT 
        COUNT(*) as total_bookings,
        COALESCE(SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END), 0) as pending_bookings,
        COALESCE(SUM(CASE WHEN status = 'Confirmed' THEN 1 ELSE 0 END), 0) as confirmed_bookings
      FROM makeup_bookings
    `).get();

    // 3. Product stats
    const productStats = db.prepare(`
      SELECT 
        COUNT(*) as total_products,
        COALESCE(SUM(CASE WHEN stock <= 5 THEN 1 ELSE 0 END), 0) as low_stock_count,
        COALESCE(SUM(CASE WHEN stock = 0 THEN 1 ELSE 0 END), 0) as out_of_stock_count
      FROM products
    `).get();

    // 4. Contact messages
    const messageStats = db.prepare(`
      SELECT 
        COUNT(*) as total_messages,
        COALESCE(SUM(CASE WHEN status = 'New' THEN 1 ELSE 0 END), 0) as new_messages
      FROM contact_messages
    `).get();

    // 5. Recent orders (latest 5)
    const recentOrders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT 5').all();
    const recentOrdersEnriched = recentOrders.map(ord => {
      const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(ord.id);
      return { ...ord, items };
    });

    // 6. Upcoming Bookings
    const upcomingBookings = db.prepare('SELECT * FROM makeup_bookings ORDER BY event_date ASC, created_at DESC LIMIT 5').all();

    // 7. Low stock items
    const lowStockItems = db.prepare('SELECT id, name, category, subcategory, price, stock, image_url FROM products WHERE stock <= 5 ORDER BY stock ASC LIMIT 6').all();

    return res.json({
      success: true,
      stats: {
        totalOrders: orderStats.total_orders,
        totalRevenue: Math.round(orderStats.total_revenue),
        pendingOrders: orderStats.pending_orders,
        deliveredOrders: orderStats.delivered_orders,
        totalBookings: bookingStats.total_bookings,
        pendingBookings: bookingStats.pending_bookings,
        confirmedBookings: bookingStats.confirmed_bookings,
        totalProducts: productStats.total_products,
        lowStockCount: productStats.low_stock_count,
        outOfStockCount: productStats.out_of_stock_count,
        newMessages: messageStats.new_messages
      },
      recentOrders: recentOrdersEnriched,
      upcomingBookings,
      lowStockItems
    });
  } catch (err) {
    console.error('[Stats Controller] Error generating dashboard stats:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { getDashboardStats };
