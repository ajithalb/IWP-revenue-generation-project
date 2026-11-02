require('dotenv').config();
const app = require('./app');
const db = require('./database/db');
const seedDatabase = require('./database/seed');

const PORT = process.env.PORT || 5001;

// Verify database has data, seed if fresh
try {
  const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get();
  if (!productCount || productCount.count === 0) {
    console.log('[Server] Database is empty. Running initial seeding...');
    seedDatabase();
  }
} catch (err) {
  console.warn('[Server] Seed check error, running seed:', err.message);
  try {
    seedDatabase();
  } catch (seedErr) {
    console.error('[Server] Failed to seed database:', seedErr);
  }
}

app.listen(PORT, () => {
  console.log(`======================================================`);
  console.log(`  Sasti Boutique Backend Server is Running!`);
  console.log(`  API Base URL: http://localhost:${PORT}/api`);
  console.log(`  Health Check: http://localhost:${PORT}/api/health`);
  console.log(`  Default Admin: admin / Admin@Sasti2026`);
  console.log(`======================================================`);
});
