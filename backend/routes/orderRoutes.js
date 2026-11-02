const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { requireAdmin } = require('../middleware/authMiddleware');

// Public checkout & tracking routes
router.post('/', orderController.createOrder);
router.get('/track/:identifier', orderController.getOrderDetails);

// Admin protected routes
router.get('/', requireAdmin, orderController.getAllOrders);
router.patch('/:id/status', requireAdmin, orderController.updateOrderStatus);

module.exports = router;
