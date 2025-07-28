const mongoose = require('mongoose');
const Category = require('./models/Category');
const User = require('./models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const createCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find admin user for createdBy field
    const admin = await User.findOne({ email: 'admin@aicosmetics.com' });
    if (!admin) {
      console.log('❌ Admin user not found. Please run setup-admin.js first.');
      return;
    }
    console.log('✅ Found admin user for category creation');

    const categories = [
      {
        name: 'Skincare',
        description: 'Face and body skincare products',
        isActive: true
      },
      {
        name: 'Makeup',
        description: 'Cosmetic and beauty makeup products',
        isActive: true
      },
      {
        name: 'Haircare',
        description: 'Hair treatment and styling products',
        isActive: true
      },
      {
        name: 'Fragrance',
        description: 'Perfumes and body sprays',
        isActive: true
      },
      {
        name: 'Tools & Accessories',
        description: 'Beauty tools and accessories',
        isActive: true
      }
    ];

    for (const categoryData of categories) {
      const existingCategory = await Category.findOne({ name: categoryData.name });
      if (!existingCategory) {
        await Category.create({
          ...categoryData,
          createdBy: admin._id
        });
        console.log(`✅ Created category: ${categoryData.name}`);
      } else {
        console.log(`⚠️ Category already exists: ${categoryData.name}`);
      }
    }

    console.log('\n📋 All categories processed successfully!');
    
    const allCategories = await Category.find({});
    console.log(`\n📊 Total categories in database: ${allCategories.length}`);
    allCategories.forEach(cat => {
      console.log(`   - ${cat.name} (ID: ${cat._id})`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
};

createCategories();
