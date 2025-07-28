import React from 'react';
import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  // Handle image display with fallback
  const getImageSrc = () => {
    if (product.images && product.images.length > 0) {
      // If images is an array of objects with url property
      if (typeof product.images[0] === 'object' && product.images[0].url) {
        // Check if it's a full URL or relative path
        const imageUrl = product.images[0].url;
        return imageUrl.startsWith('http') ? imageUrl : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${imageUrl}`;
      }
      // If images is an array of strings
      if (typeof product.images[0] === 'string') {
        const imageUrl = product.images[0];
        return imageUrl.startsWith('http') ? imageUrl : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${imageUrl}`;
      }
    }
    // Fallback to a data URL image
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmJlN2Y2Ii8+PHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI0OCIgZmlsbD0iI2Y5YThmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPvCfkpE8L3RleHQ+PHRleHQgeD0iNTAlIiB5PSI2NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iI2Y5YThmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJlYXV0eSBQcm9kdWN0PC90ZXh0Pjwvc3ZnPg==';
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-pink-100 h-full flex flex-col">
      {/* Image Container */}
      <div className="relative w-full h-48 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center overflow-hidden flex-shrink-0">
        <img 
          src={getImageSrc()}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmJlN2Y2Ii8+PHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI0OCIgZmlsbD0iI2Y5YThmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPvCfkpE8L3RleHQ+PHRleHQgeD0iNTAlIiB5PSI2NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iI2Y5YThmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJlYXV0eSBQcm9kdWN0PC90ZXh0Pjwvc3ZnPg==';
          }}
        />
        {/* Discount Badge */}
        {product.discount && product.discount > 0 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            -{product.discount}%
          </div>
        )}
        {/* Featured Badge */}
        {product.isFeatured && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            ⭐ Featured
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Top Content - Flexible */}
        <div className="flex-1">
          {/* Product Name */}
          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-700 transition-colors duration-300 min-h-[3rem]">
            {product.name}
          </h3>
          
          {/* Brand */}
          {product.brand && (
            <p className="text-sm text-purple-600 font-medium mb-3 uppercase tracking-wide">
              {product.brand}
            </p>
          )}
          
          {/* Price Section */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  Rs. {product.price}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-gray-500 line-through">
                    Rs. {product.originalPrice}
                  </span>
                )}
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-green-600 font-medium">
                  Save Rs. {(product.originalPrice - product.price).toFixed(0)}
                </span>
              )}
            </div>
            
            {/* Rating */}
            {product.rating && product.rating > 0 && (
              <div className="flex items-center space-x-1">
                <span className="text-yellow-400">⭐</span>
                <span className="text-sm font-medium text-gray-600">
                  {product.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Bottom Content - Fixed */}
        <div className="mt-auto">
          {/* Stock Status */}
          <div className="mb-4">
            {product.countInStock > 0 ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✅ In Stock ({product.countInStock})
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                ❌ Out of Stock
              </span>
            )}
          </div>
          
          {/* Action Button */}
          <Link
            to={`/product/${product._id}`}
            className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 block text-center transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            💫 View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;