const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { requireAdmin } = require('../middleware/authMiddleware');

// Public contact & newsletter
router.post('/', contactController.submitContact);
router.post('/newsletter', contactController.subscribeNewsletter);

// Admin protected routes
router.get('/', requireAdmin, contactController.getAllContacts);
router.patch('/:id/status', requireAdmin, contactController.updateContactStatus);

module.exports = router;
