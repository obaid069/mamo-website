const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const fixProductImages = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find all products without proper images
    const products = await Product.find({});
    console.log(`📦 Found ${products.length} products to check`);

    let updatedCount = 0;

    for (const product of products) {
      let needsUpdate = false;
      let processedImages = [];

      // Check if product has no images or invalid images
      if (!product.images || product.images.length === 0) {
        needsUpdate = true;
        processedImages = [{
          url: `https://via.placeholder.com/400x300/f8fafc/64748b?text=${encodeURIComponent(product.name.substring(0, 20))}`,
          alt: product.name
        }];
      } else {
        // Check existing images and fix invalid ones
        processedImages = product.images.map(img => {
          if (typeof img === 'string') {
            if (!img.startsWith('http')) {
              needsUpdate = true;
              return {
                url: `https://via.placeholder.com/400x300/f8fafc/64748b?text=${encodeURIComponent(product.name.substring(0, 20))}`,
                alt: product.name
              };
            }
            return {
              url: img,
              alt: product.name
            };
          } else if (img && typeof img === 'object') {
            if (!img.url || !img.url.startsWith('http')) {
              needsUpdate = true;
              return {
                url: `https://via.placeholder.com/400x300/f8fafc/64748b?text=${encodeURIComponent(product.name.substring(0, 20))}`,
                alt: img.alt || product.name
              };
            }
            return img;
          } else {
            needsUpdate = true;
            return {
              url: `https://via.placeholder.com/400x300/f8fafc/64748b?text=${encodeURIComponent(product.name.substring(0, 20))}`,
              alt: product.name
            };
          }
        });
      }

      if (needsUpdate) {
        await Product.findByIdAndUpdate(product._id, {
          images: processedImages
        });
        console.log(`✅ Updated images for: ${product.name}`);
        updatedCount++;
      }
    }

    console.log(`\n🎉 Successfully updated ${updatedCount} products with placeholder images`);
    console.log('📝 All products now have valid image URLs for Vercel deployment');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing product images:', error);
    process.exit(1);
  }
};

fixProductImages();
