import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './styles/animations.css';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <div className="min-h-screen bg-white text-primary">
      <ErrorBoundary>
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={
          <AdminProtectedRoute>
            <AdminDashboardPage />
          </AdminProtectedRoute>
        } />
        <Route path="/admin/add-product" element={
          <AdminProtectedRoute>
            <AddProductPage />
          </AdminProtectedRoute>
        } />
        <Route path="/admin/edit-product/:id" element={
          <AdminProtectedRoute>
            <EditProductPage />
          </AdminProtectedRoute>
        } />
        {/* Catch-all route for undefined URLs */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </ErrorBoundary>
    </div>
  );
}

export default App;