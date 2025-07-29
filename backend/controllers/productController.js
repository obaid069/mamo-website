const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const category = req.query.category ? { category: req.query.category } : {};
    const priceRange = req.query.minPrice && req.query.maxPrice 
      ? { price: { $gte: req.query.minPrice, $lte: req.query.maxPrice } }
      : {};

    const filter = { ...keyword, ...category, ...priceRange, isActive: true };

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate('category', 'name')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name')
      .populate('reviews.user', 'name');

    if (product) {
      // Increment views count atomically
      await Product.findByIdAndUpdate(
        req.params.id,
        { $inc: { views: 1 } },
        { new: false } // Don't return updated document to avoid extra query
      );
      
      // Return the product with incremented view count
      const updatedProduct = {
        ...product.toObject(),
        views: (product.views || 0) + 1
      };
      
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      discount,
      category,
      brand,
      countInStock,
      tags,
      images,
      isActive,
      isFeatured
    } = req.body;

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: 'Category not found' });
    }

    // Process images - ensure they are full URLs for Vercel compatibility
    const processedImages = images && images.length > 0 ? images.map(img => {
      if (typeof img === 'string') {
        // If it's just a URL string, convert to object format
        return {
          url: img.startsWith('http') ? img : `https://placehold.co/400x300/f8fafc/64748b/png?text=${encodeURIComponent(name.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '+'))}`,
          alt: name
        };
      }
      // If it's already an object, ensure URL is valid
      return {
        url: img.url && img.url.startsWith('http') ? img.url : `https://placehold.co/400x300/f8fafc/64748b/png?text=${encodeURIComponent(name.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '+'))}`,
        alt: img.alt || name
      };
    }) : [{
      url: `https://placehold.co/400x300/f8fafc/64748b/png?text=${encodeURIComponent(name.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '+'))}`,
      alt: name
    }];

    const product = new Product({
      name,
      description,
      price,
      originalPrice,
      discount,
      category,
      brand,
      countInStock,
      tags,
      images: processedImages,
      isActive: isActive !== undefined ? isActive : true,
      isFeatured: isFeatured !== undefined ? isFeatured : false,
      createdBy: req.user._id,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = req.body.name || product.name;
      product.description = req.body.description || product.description;
      product.price = req.body.price || product.price;
      product.originalPrice = req.body.originalPrice || product.originalPrice;
      product.discount = req.body.discount || product.discount;
      product.category = req.body.category || product.category;
      product.brand = req.body.brand || product.brand;
      product.countInStock = req.body.countInStock || product.countInStock;
      product.tags = req.body.tags || product.tags;
      product.isFeatured = req.body.isFeatured !== undefined ? req.body.isFeatured : product.isFeatured;
      product.isActive = req.body.isActive !== undefined ? req.body.isActive : product.isActive;
      
      // Handle image updates
      if (req.body.images && Array.isArray(req.body.images)) {
        const processedImages = req.body.images
          .filter(img => img && img.trim() !== '') // Remove empty URLs
          .map(img => {
            if (typeof img === 'string') {
              return {
                url: img.startsWith('http') ? img : `https://placehold.co/400x300/f8fafc/64748b/png?text=${encodeURIComponent(product.name.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '+'))}`,
                alt: product.name
              };
            }
            return {
              url: img.url && img.url.startsWith('http') ? img.url : `https://placehold.co/400x300/f8fafc/64748b/png?text=${encodeURIComponent(product.name.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '+'))}`,
              alt: img.alt || product.name
            };
          });
        
        product.images = processedImages.length > 0 ? processedImages : [{
          url: `https://placehold.co/400x300/f8fafc/64748b/png?text=${encodeURIComponent(product.name.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '+'))}`,
          alt: product.name
        }];
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400).json({ message: 'Product already reviewed' });
        return;
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.calculateAverageRating();

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true })
      .populate('category', 'name')
      .limit(8)
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all products for admin
// @route   GET /api/products/admin
// @access  Private/Admin
const getAdminProducts = async (req, res) => {
  try {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const category = req.query.category ? { category: req.query.category } : {};
    const priceRange = req.query.minPrice && req.query.maxPrice 
      ? { price: { $gte: req.query.minPrice, $lte: req.query.maxPrice } }
      : {};
    
    // For admin, include both active and inactive products
    const filter = { ...keyword, ...category, ...priceRange };

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate('category', 'name')
      .populate('createdBy', 'name email')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    console.error('Admin products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getFeaturedProducts,
  getAdminProducts,
};
