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
// Use Cloudinary upload instead of local upload
const { upload } = require('../config/cloudinary');

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

// Image upload route - handle multiple files with Cloudinary
router.post('/upload', protect, admin, upload.array('images', 10), (req, res) => {
  try {
    if (req.files && req.files.length > 0) {
      // Cloudinary automatically provides the secure_url
      const imageUrls = req.files.map(file => ({
        url: file.path, // Cloudinary provides the full URL in file.path
        alt: file.originalname,
        public_id: file.filename // Cloudinary public_id for deletion if needed
      }));
      
      res.json({
        message: 'Images uploaded successfully to Cloudinary',
        imageUrls: imageUrls
      });
    } else {
      res.status(400).json({ message: 'No images uploaded' });
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ message: 'Image upload failed', error: error.message });
  }
});

module.exports = router;
