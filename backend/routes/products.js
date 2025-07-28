const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getFeaturedProducts,
  getAdminProducts,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/featured').get(getFeaturedProducts);
router.route('/admin').get(protect, admin, getAdminProducts);
router.route('/:id/reviews').post(protect, createProductReview);
router
  .route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

// Image upload route
router.post('/upload', protect, admin, upload.single('image'), (req, res) => {
  if (req.file) {
    res.json({
      message: 'Image uploaded successfully',
      image: `/${req.file.path.replace(/\\/g, '/')}`
    });
  } else {
    res.status(400).json({ message: 'No image uploaded' });
  }
});

module.exports = router;
