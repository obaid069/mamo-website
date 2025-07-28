const express = require('express');
const {
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  addToCart,
  getCart,
  removeFromCart,
  toggleWishlist,
  getWishlist,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(protect, admin, getUsers);
router.route('/cart').post(protect, addToCart).get(protect, getCart);
router.route('/cart/:productId').delete(protect, removeFromCart);
router.route('/wishlist').get(protect, getWishlist);
router.route('/wishlist/:productId').post(protect, toggleWishlist);
router
  .route('/:id')
  .get(protect, admin, getUserById)
  .delete(protect, admin, deleteUser)
  .put(protect, admin, updateUser);

module.exports = router;

