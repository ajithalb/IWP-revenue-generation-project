const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { requireAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/services', bookingController.getServices);
router.post('/', bookingController.createBooking);
router.get('/track/:ref', bookingController.getBookingByRef);

// Admin protected routes
router.put('/services/:id', requireAdmin, bookingController.updateServicePrice);
router.get('/', requireAdmin, bookingController.getAllBookings);
router.patch('/:id/status', requireAdmin, bookingController.updateBookingStatus);

module.exports = router;
