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
router.post('/upload', protect, admin, (req, res) => {
  // Add error handling middleware for multer
  upload.array('images', 10)(req, res, (err) => {
    if (err) {
      console.error('Multer/Cloudinary upload error:', err);
      
      // Check if it's a Cloudinary configuration error
      if (err.message && err.message.includes('Must supply cloud_name')) {
        return res.status(500).json({ 
          message: 'Cloudinary configuration error - credentials not set properly',
          error: 'Please check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env file'
        });
      }
      
      // Other multer errors
      return res.status(500).json({ 
        message: 'File upload error', 
        error: err.message 
      });
    }
    
    try {
      if (req.files && req.files.length > 0) {
        // Cloudinary automatically provides the secure_url
        const imageUrls = req.files.map(file => ({
          url: file.path, // Cloudinary provides the full URL in file.path
          alt: file.originalname,
          public_id: file.filename // Cloudinary public_id for deletion if needed
        }));
        
        console.log('Images uploaded successfully:', imageUrls.length, 'files');
        
        res.json({
          message: 'Images uploaded successfully to Cloudinary',
          imageUrls: imageUrls
        });
      } else {
        res.status(400).json({ message: 'No images uploaded - no files received' });
      }
    } catch (error) {
      console.error('Cloudinary upload processing error:', error);
      res.status(500).json({ 
        message: 'Image upload processing failed', 
        error: error.message 
      });
    }
  });
});

module.exports = router;
