import React, { memo } from 'react';
import { Link } from 'react-router-dom';

// Optimized AdminProductCard component with memoization
function AdminProductCard({ product, onDelete }) {
  // Optimized image handling with better fallback
  const getImageSrc = () => {
    // Check if product and images exist
    if (!product?.images || product.images.length === 0) {
      return `https://via.placeholder.com/400x300/e2e8f0/64748b?text=${encodeURIComponent(product?.name?.substring(0, 15) || 'Product')}`;
    }

    const firstImage = product.images[0];
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    
    // Handle object format {url: '', alt: ''}
    if (typeof firstImage === 'object' && firstImage?.url) {
      const imageUrl = firstImage.url;
      return imageUrl.startsWith('http') 
        ? imageUrl 
        : `${baseUrl}${imageUrl}`;
    }
    
    // Handle string format
    if (typeof firstImage === 'string') {
      const imageUrl = firstImage;
      return imageUrl.startsWith('http') 
        ? imageUrl 
        : `${baseUrl}${imageUrl}`;
    }
    
    // Final fallback
    return `https://via.placeholder.com/400x300/e2e8f0/64748b?text=${encodeURIComponent(product.name.substring(0, 15))}`;
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border border-purple-100">
      {/* Image Container */}
      <div className="relative w-full h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center overflow-hidden">
        <img 
          src={getImageSrc()}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmJlN2Y2Ii8+PHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI0OCIgZmlsbD0iI2Y5YThmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPvCflLE8L3RleHQ+PHRleHQgeD0iNTAlIiB5PSI2NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iI2Y5YThmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFkbWluIFByb2R1Y3Q8L3RleHQ+PC9zdmc+';
          }}
        />
        {/* Admin Badge */}
        <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          ⚙️ ADMIN
        </div>
        {/* Status Badge */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
          product.isActive 
            ? 'bg-gradient-to-r from-green-400 to-green-500 text-white'
            : 'bg-gradient-to-r from-red-400 to-red-500 text-white'
        }`}>
          {product.isActive ? '✅ Active' : '❌ Inactive'}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Product Name */}
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-700 transition-colors duration-300">
          {product.name}
        </h3>
        
        {/* Price and Stock Info */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
            Rs. {product.price}
          </span>
          <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
            Stock: {product.countInStock}
          </span>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Link
            to={`/admin/edit-product/${product._id}`}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-2.5 px-4 rounded-xl font-semibold transition-all duration-300 text-center transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center"
          >
            <span className="mr-2">✏️</span>
            Edit
          </Link>
          <button
            onClick={() => onDelete(product._id)}
            className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-2.5 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center"
          >
            <span className="mr-2">🗑️</span>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminProductCard;