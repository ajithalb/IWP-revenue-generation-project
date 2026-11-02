const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAdmin } = require('../middleware/authMiddleware');

router.post('/login', authController.login);
router.get('/me', requireAdmin, authController.getMe);
router.post('/change-password', requireAdmin, authController.changePassword);

module.exports = router;
