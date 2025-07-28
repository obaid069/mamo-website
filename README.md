# Mamo Website

A full-stack e-commerce website built with React and Node.js.

## Project Structure

```
mamo-website/
├── frontend/          # React frontend application
├── backend/           # Node.js backend API
├── README.md
└── .gitignore
```

## Frontend
- **Framework**: React with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios

## Backend
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **File Upload**: Multer
- **Security**: bcryptjs, CORS

## Features
- User authentication (admin/customer)
- Product management
- Category management
- Shopping cart functionality
- Order management
- Admin dashboard
- Responsive design

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_MODE=development
```

## Local Development

1. Clone the repository
2. Install backend dependencies: `cd backend && npm install`
3. Install frontend dependencies: `cd frontend && npm install`
4. Start backend: `cd backend && npm run dev`
5. Start frontend: `cd frontend && npm run dev`

## Deployment

This project is configured for deployment on Vercel:
- Backend: Serverless functions
- Frontend: Static site with Vite build

## License

This project is private and proprietary.
