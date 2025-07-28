const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Order = require('./models/Order');

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const users = [
  {
    name: 'Admin User',
    email: 'admin@aicosmetics.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: '123456',
  },
  {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: '123456',
  },
];

const categories = [
  {
    name: 'Skincare',
    description: 'Premium skincare products for all skin types',
  },
  {
    name: 'Makeup',
    description: 'High-quality makeup products',
  },
  {
    name: 'Fragrances',
    description: 'Luxury fragrances and perfumes',
  },
  {
    name: 'Hair Care',
    description: 'Professional hair care products',
  },
];

const products = [
  {
    name: 'Anti-Aging Serum',
    description: 'Advanced anti-aging serum with retinol and hyaluronic acid. Reduces fine lines and wrinkles while hydrating the skin.',
    price: 89.99,
    originalPrice: 119.99,
    discount: 25,
    brand: 'AI Beauty',
    countInStock: 50,
    rating: 4.5,
    numReviews: 12,
    specifications: {
      weight: '30ml',
      ingredients: ['Retinol', 'Hyaluronic Acid', 'Vitamin C'],
      skinType: 'All skin types',
      ageRange: '25+',
    },
    tags: ['anti-aging', 'serum', 'premium'],
    isFeatured: true,
  },
  {
    name: 'Hydrating Face Cream',
    description: 'Luxurious moisturizing cream with natural botanicals. Perfect for dry and sensitive skin.',
    price: 49.99,
    originalPrice: 69.99,
    discount: 29,
    brand: 'AI Beauty',
    countInStock: 30,
    rating: 4.2,
    numReviews: 8,
    specifications: {
      weight: '50ml',
      ingredients: ['Shea Butter', 'Aloe Vera', 'Jojoba Oil'],
      skinType: 'Dry, Sensitive',
      ageRange: 'All ages',
    },
    tags: ['moisturizer', 'hydrating', 'natural'],
    isFeatured: true,
  },
  {
    name: 'Vitamin C Brightening Mask',
    description: 'Brightening face mask enriched with Vitamin C and natural extracts. Reveals radiant, glowing skin.',
    price: 34.99,
    originalPrice: 44.99,
    discount: 22,
    brand: 'AI Beauty',
    countInStock: 25,
    rating: 4.7,
    numReviews: 15,
    specifications: {
      weight: '75ml',
      ingredients: ['Vitamin C', 'Niacinamide', 'Green Tea Extract'],
      skinType: 'All skin types',
      ageRange: '18+',
    },
    tags: ['mask', 'brightening', 'vitamin-c'],
    isFeatured: false,
  },
  {
    name: 'Luxury Lipstick Set',
    description: 'Premium lipstick collection with 5 stunning shades. Long-lasting, highly pigmented formula.',
    price: 79.99,
    originalPrice: 99.99,
    discount: 20,
    brand: 'AI Makeup',
    countInStock: 20,
    rating: 4.3,
    numReviews: 6,
    specifications: {
      weight: '5 x 3.5g',
      ingredients: ['Natural Waxes', 'Vitamin E', 'Jojoba Oil'],
    },
    tags: ['lipstick', 'makeup', 'luxury'],
    isFeatured: true,
  },
];

const importData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    // Create users
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    console.log('Users imported!');

    // Create categories
    const sampleCategories = categories.map((category) => {
      return { ...category, createdBy: adminUser };
    });

    const createdCategories = await Category.insertMany(sampleCategories);
    console.log('Categories imported!');

    // Create products
    const sampleProducts = products.map((product) => {
      return {
        ...product,
        category: createdCategories[0]._id, // Assign first category (Skincare) to products
        createdBy: adminUser,
      };
    });

    // Assign makeup category to lipstick
    sampleProducts[3].category = createdCategories[1]._id;

    await Product.insertMany(sampleProducts);
    console.log('Products imported!');

    console.log('Data Imported Successfully!');
    console.log('Admin credentials:');
    console.log('Email: admin@aicosmetics.com');
    console.log('Password: admin123');
    
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
