const express = require('express');
const { protect, admin } = require('../middleware/auth');
const path = require('path');

const router = express.Router();

// Admin dashboard route - protect with authentication
router.get('/dashboard', protect, admin, (req, res) => {
  // In a full application, you might serve the admin dashboard here
  // For now, just return success if user is authenticated admin
  res.json({ 
    message: 'Admin dashboard access granted',
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// Serve admin static files with authentication
router.use('/static', protect, admin, express.static(path.join(__dirname, '../admin-static')));

module.exports = router;
