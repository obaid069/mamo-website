# Cloudinary Setup Instructions - Fix Image Upload Issue

## Problem
Image upload karne pe server error aa raha hai kyunki Cloudinary credentials properly set nahi hain.

## Solution

### Step 1: Create Cloudinary Account
1. Go to https://cloudinary.com
2. Sign up for FREE account
3. Login to your dashboard

### Step 2: Get Credentials
1. Dashboard main jao
2. "Account Details" section main ye 3 values copy karo:
   - **Cloud Name** (e.g., `dl1a2b3c4d`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnop1234567890`)

### Step 3: Update Environment File
Open `backend/.env` file and replace these lines:

```env
# Replace these lines:
CLOUDINARY_CLOUD_NAME=your_cloud_name_from_dashboard
CLOUDINARY_API_KEY=your_api_key_from_dashboard
CLOUDINARY_API_SECRET=your_api_secret_from_dashboard

# With your actual values (example):
CLOUDINARY_CLOUD_NAME=dl1a2b3c4d
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnop1234567890
```

### Step 4: Test Image Upload
1. Backend server restart karo: `npm run dev`
2. Admin panel main jao
3. Product edit karo
4. Photo upload karo
5. Ab error nahi aana chahiye!

## Important Notes
- Account FREE hai, 25GB storage aur 25K monthly transformations milte hain
- Images automatically optimize ho jati hain
- CDN se fast delivery hoti hai
- Production ready solution hai

## Troubleshooting
If still error aa raha hai:
1. Check `.env` file main spaces nahi hain
2. Server restart kiya hai ya nahi
3. Cloudinary dashboard main quota check karo
4. Network connection check karo

## Backup Option
Agar Cloudinary setup nahi karna chahte, to local storage use kar sakte hain:
- `backend/middleware/upload.js` file edit karo
- Multer local storage configuration enable karo
- But production deployment main issues ho sakte hain
