# AI Cosmetics E-commerce Backend

A complete MERN stack backend for an e-commerce cosmetics website.

## Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (User/Admin)
  - Password hashing with bcrypt

- **Product Management**
  - CRUD operations for products
  - Product categories and subcategories
  - Image upload functionality
  - Product reviews and ratings
  - Search and filtering

- **Order Management**
  - Complete order lifecycle
  - Order status tracking
  - Payment integration ready
  - Order cancellation

- **User Features**
  - Shopping cart functionality
  - Wishlist management
  - User profile management

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Password Hashing**: bcryptjs

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   - The `.env` file is already configured with your MongoDB connection
   - Update JWT_SECRET for production use

3. **Seed Database**
   ```bash
   node seeder.js
   ```
   This will create sample data including:
   - Admin user
   - Sample categories
   - Sample products
   - Regular users

4. **Start the Server**
   ```bash
   # Development mode with nodemon
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## Admin Credentials

After running the seeder, you can login with:
- **Email**: admin@aicosmetics.com
- **Password**: admin123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products (with pagination, search, filter)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)
- `GET /api/products/featured` - Get featured products
- `POST /api/products/:id/reviews` - Add product review

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders (Admin only)
- `GET /api/orders/myorders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/pay` - Update order to paid
- `PUT /api/orders/:id/deliver` - Update order to delivered (Admin only)
- `PUT /api/orders/:id/cancel` - Cancel order

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)
- `POST /api/users/cart` - Add item to cart
- `GET /api/users/cart` - Get user cart
- `DELETE /api/users/cart/:productId` - Remove item from cart
- `GET /api/users/wishlist` - Get user wishlist
- `POST /api/users/wishlist/:productId` - Toggle wishlist item

## Database Models

### User
- Personal information (name, email, phone, address)
- Authentication (password, role)
- Shopping cart and wishlist
- Timestamps

### Product
- Product details (name, description, price, brand)
- Category relationship
- Images and specifications
- Reviews and ratings
- Stock management

### Category
- Category hierarchy support
- Parent-child relationships
- Active/inactive status

### Order
- User relationship
- Order items with quantities
- Shipping and payment information
- Order status tracking
- Order numbering system

## File Structure

```
backend/
├── config/          # Database configuration
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/          # Database models
├── routes/          # API routes
├── uploads/         # File uploads directory
├── .env            # Environment variables
├── server.js       # Main server file
├── seeder.js       # Database seeder
└── README.md       # Documentation
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected routes with middleware
- Input validation
- File upload restrictions
- CORS enabled

## Development Notes

- All passwords are hashed before storing
- JWT tokens expire in 30 days
- File uploads are restricted to images only
- Maximum file size: 5MB
- MongoDB connection with retry logic
- Error handling middleware

## Production Deployment

1. Set environment variables securely
2. Use a production-grade MongoDB setup
3. Configure proper CORS settings
4. Set up proper file storage (AWS S3, etc.)
5. Implement rate limiting
6. Add SSL/TLS encryption
7. Set up monitoring and logging
