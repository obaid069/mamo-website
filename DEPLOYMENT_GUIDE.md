# 🚀 Vercel Deployment Guide for Mamo Website

This guide will help you deploy your Mamo Website (frontend + backend) on Vercel.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Account**: Your code should be on GitHub
3. **MongoDB Atlas**: Your database should be on MongoDB Atlas (cloud)

## 🛠️ Deployment Steps

### Step 1: Prepare Your Code

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/mamo-website.git
   git push -u origin main
   ```

### Step 2: Deploy Backend API

1. **Go to Vercel Dashboard** → New Project
2. **Import from GitHub** → Select your repository
3. **Configure Project**:
   - Framework Preset: **Other**
   - Root Directory: **backend**
   - Build Command: **(leave empty)**
   - Output Directory: **(leave empty)**

4. **Environment Variables** (Add these in Vercel dashboard):
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=production
   ```

5. **Deploy** → Your backend will be available at: `https://your-backend.vercel.app`

### Step 3: Deploy Frontend

1. **Go to Vercel Dashboard** → New Project  
2. **Import from GitHub** → Select your repository (again)
3. **Configure Project**:
   - Framework Preset: **Vite**
   - Root Directory: **frontend**
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Environment Variables** (Add in Vercel dashboard):
   ```
   VITE_API_URL=https://your-backend.vercel.app/api
   VITE_MODE=production
   ```

5. **Deploy** → Your frontend will be available at: `https://your-frontend.vercel.app`

### Step 4: Update Frontend Environment

1. **Update** `frontend/.env.production`:
   ```
   VITE_API_URL=https://your-actual-backend-url.vercel.app/api
   VITE_MODE=production
   ```

2. **Redeploy** frontend after updating the environment file.

## 🔧 Important Configuration Changes

### Backend Changes for Production

The backend is already configured with:
- ✅ CORS enabled for all origins
- ✅ Static file serving for uploads
- ✅ MongoDB connection with retry logic
- ✅ Error handling middleware

### Frontend Changes for Production

The frontend is configured with:
- ✅ Environment variable for API URL
- ✅ Image URL construction for both development and production
- ✅ React Router with proper routing
- ✅ Error boundaries and exception handling

## 🗂️ File Structure After Deployment

```
your-repo/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vercel.json          ← Frontend deployment config
│   └── .env.production      ← Production environment variables
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── vercel.json          ← Backend deployment config
└── DEPLOYMENT_GUIDE.md      ← This file
```

## 🌐 Domain Configuration (Optional)

1. **Buy a domain** (e.g., from Namecheap, GoDaddy)
2. **In Vercel Dashboard**:
   - Go to your frontend project
   - Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

## 📱 Testing Your Deployment

1. **Test Backend API**:
   ```
   https://your-backend.vercel.app/api/products
   ```

2. **Test Frontend**:
   ```
   https://your-frontend.vercel.app
   ```

3. **Test Full Flow**:
   - Browse products
   - View product details
   - Check WhatsApp integration
   - Verify admin functionality

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **JWT Secret**: Use a strong, unique secret
3. **MongoDB**: Ensure IP whitelist is configured
4. **CORS**: Consider restricting origins in production
5. **File Uploads**: Consider using cloud storage (Cloudinary, AWS S3)

## 🚨 Common Issues & Solutions

### Issue 1: API calls failing
**Solution**: Check VITE_API_URL environment variable in frontend

### Issue 2: Images not loading
**Solution**: Ensure backend URL is correct and accessible

### Issue 3: 404 errors on page refresh
**Solution**: Vercel.json is configured with proper rewrites

### Issue 4: Build failures
**Solution**: Check Node.js version compatibility (use Node 18+)

## 📞 WhatsApp Integration

The WhatsApp button is configured with:
- Phone: `03165539458` (Pakistan format)
- Automatic message with product details
- Direct link to WhatsApp Web/App

## 🎯 Next Steps After Deployment

1. **Test all functionality**
2. **Set up monitoring** (Vercel Analytics)
3. **Configure custom domain**
4. **Set up backup strategy**
5. **Monitor performance**

## 📝 Notes

- **Free Tier Limits**: Vercel free tier has usage limits
- **Database**: MongoDB Atlas free tier is sufficient for starting
- **Images**: Consider cloud storage for production (current setup stores in backend)
- **SSL**: Vercel provides free SSL certificates

---

**Need Help?** 
- Vercel Documentation: https://vercel.com/docs
- Contact: Your development team

**Deployment Date**: $(date)
**Version**: 1.0.0
