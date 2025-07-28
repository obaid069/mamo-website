const express = require('express');
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getParentCategories,
  getSubcategories,
} = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(getCategories).post(protect, admin, createCategory);
router.route('/parents').get(getParentCategories);
router.route('/parent/:parentId').get(getSubcategories);
router
  .route('/:id')
  .get(getCategoryById)
  .put(protect, admin, updateCategory)
  .delete(protect, admin, deleteCategory);

module.exports = router;
