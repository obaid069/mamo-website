import React from 'react';
import { useState } from 'react';

function ProductDetails({ product }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Debug logging (remove in production)
  if (import.meta.env.DEV) {
    console.log('ProductDetails received product:', product);
    console.log('Product images:', product?.images);
  }

  // Helper function to construct proper image URL
  const constructImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-image.svg';
    
    // If it's already a complete URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Get base URL from environment variable
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    
    // If it starts with /uploads/, it's already properly formatted for backend
    if (imagePath.startsWith('/uploads/')) {
      return `${baseUrl}${imagePath}`;
    }
    
    // If it starts with /, treat as absolute path from backend root
    if (imagePath.startsWith('/')) {
      return `${baseUrl}${imagePath}`;
    }
    
    // If it's just a filename, add /uploads/ prefix
    return `${baseUrl}/uploads/${imagePath}`;
  };

  // Safely get images - handle both array of strings and array of objects
  const getImages = () => {
    if (import.meta.env.DEV) {
      console.log('getImages called with product.images:', product?.images);
    }
    
    if (!product?.images || !Array.isArray(product.images) || product.images.length === 0) {
      if (import.meta.env.DEV) {
        console.log('No images found, using placeholder');
      }
      return ['/placeholder-image.svg']; // Fallback image
    }
    
    const processedImages = product.images.map((img, index) => {
      if (import.meta.env.DEV) {
        console.log(`Processing image ${index}:`, img, 'Type:', typeof img);
      }
      
      let imageUrl;
      
      if (typeof img === 'string') {
        if (import.meta.env.DEV) {
          console.log('Image is string:', img);
        }
        imageUrl = constructImageUrl(img);
      } else if (typeof img === 'object' && img.url) {
        if (import.meta.env.DEV) {
          console.log('Image is object with url:', img.url);
        }
        imageUrl = constructImageUrl(img.url);
      } else {
        if (import.meta.env.DEV) {
          console.log('Image fallback used for:', img);
        }
        return '/placeholder-image.svg';
      }
      
      if (import.meta.env.DEV) {
        console.log('Final image URL:', imageUrl);
      }
      return imageUrl;
    });
    
    if (import.meta.env.DEV) {
      console.log('Final processed images:', processedImages);
    }
    return processedImages;
  };

  const images = getImages();
  
  if (import.meta.env.DEV) {
    console.log('Current image index:', currentImageIndex);
    console.log('Current image src:', images[currentImageIndex]);
  }

  const nextImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
      setImageError(false);
      setImageLoading(true);
    }
  };

  const prevImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
      setImageError(false);
      setImageLoading(true);
    }
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  // Validate product data
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-red-500 text-4xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Product Data Nahi Mila</h2>
          <p className="text-gray-600">Product ki information load nahi ho payi.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 relative">
            <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
              {imageLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                  <div className="text-gray-500">Loading...</div>
                </div>
              )}
              
              {imageError ? (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-4xl mb-2">🖼️</div>
                    <p>Image Load Nahi Hua</p>
                    <button 
                      onClick={() => {
                        setImageError(false);
                        setImageLoading(true);
                      }}
                      className="mt-2 text-sm text-primary hover:underline"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              ) : (
                <img 
                  src={images[currentImageIndex]}
                  alt={product?.name || 'Product Image'}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                  style={{ display: imageLoading ? 'none' : 'block' }}
                />
              )}
            </div>
            
            {/* Navigation buttons - only show if multiple images */}
            {images.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                  aria-label="Previous image"
                >
                  ←
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                  aria-label="Next image"
                >
                  →
                </button>
                
                {/* Image indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex space-x-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentImageIndex(index);
                          setImageError(false);
                          setImageLoading(true);
                        }}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-white' : 'bg-gray-400 hover:bg-gray-300'
                        }`}
                        aria-label={`View image ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="md:w-1/2 p-8">
            {/* Product Name & Brand */}
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
              {product.brand && (
                <p className="text-lg text-gray-600">by <span className="font-semibold">{product.brand}</span></p>
              )}
            </div>

            {/* Price Section */}
            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-2">
                <p className="text-3xl font-bold text-primary">Rs. {product.price?.toLocaleString()}</p>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <p className="text-xl text-gray-500 line-through">Rs. {product.originalPrice?.toLocaleString()}</p>
                    {product.discount > 0 && (
                      <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                        {product.discount}% OFF
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Rating & Reviews */}
            {(product.rating > 0 || product.numReviews > 0) && (
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating?.toFixed(1)} ({product.numReviews} reviews)
                  </span>
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Stock Status:</span>
                {product.countInStock > 0 ? (
                  <span className="text-green-600 font-medium">
                    In Stock ({product.countInStock} available)
                  </span>
                ) : (
                  <span className="text-red-600 font-medium">Out of Stock</span>
                )}
              </div>
              {product.countInStock > 0 && product.countInStock <= 5 && (
                <p className="text-sm text-orange-600 mt-1">Only {product.countInStock} left in stock!</p>
              )}
            </div>

            {/* Category */}
            {product.category && (
              <div className="mb-6">
                <span className="text-sm font-medium text-gray-700">Category: </span>
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  {typeof product.category === 'object' ? product.category.name : product.category}
                </span>
              </div>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="mb-6">
                <span className="text-sm font-medium text-gray-700 block mb-2">Tags:</span>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Description:</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Specifications:</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  {product.specifications.weight && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">Weight:</span>
                      <span className="text-sm text-gray-600">{product.specifications.weight}</span>
                    </div>
                  )}
                  {product.specifications.dimensions && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">Dimensions:</span>
                      <span className="text-sm text-gray-600">{product.specifications.dimensions}</span>
                    </div>
                  )}
                  {product.specifications.skinType && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">Skin Type:</span>
                      <span className="text-sm text-gray-600">{product.specifications.skinType}</span>
                    </div>
                  )}
                  {product.specifications.ageRange && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">Age Range:</span>
                      <span className="text-sm text-gray-600">{product.specifications.ageRange}</span>
                    </div>
                  )}
                  {product.specifications.ingredients && product.specifications.ingredients.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-gray-700 block mb-1">Ingredients:</span>
                      <div className="text-sm text-gray-600">
                        {product.specifications.ingredients.join(', ')}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Product Stats */}
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-lg font-bold text-gray-800">{product.views || 0}</div>
                  <div className="text-sm text-gray-600">Views</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-lg font-bold text-gray-800">{product.numReviews || 0}</div>
                  <div className="text-sm text-gray-600">Reviews</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button 
                className={`w-full py-3 px-6 rounded-lg font-semibold transition duration-300 ${
                  product.countInStock > 0
                    ? 'bg-primary hover:bg-primary/80 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={product.countInStock === 0}
              >
                {product.countInStock > 0 ? 'Order Karne Ke Liye Call Kariye' : 'Out of Stock'}
              </button>
              
              {/* WhatsApp Chat Button */}
              <button 
                onClick={() => {
                  const phoneNumber = '923477027629'; // Pakistan country code + number without leading 0
                  const message = encodeURIComponent(
                    `Hi! I'm interested in this product:\n\n` +
                    `📦 ${product.name}\n` +
                    `💰 Price: Rs. ${product.price?.toLocaleString()}\n` +
                    `🔗 Link: ${window.location.href}\n\n` +
                    `Please provide more details and help me place an order.`
                  );
                  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
                  window.open(whatsappUrl, '_blank');
                }}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold transition duration-300 flex items-center justify-center space-x-2"
              >
                <span className="text-xl">💬</span>
                <span>WhatsApp Par Message Kariye</span>
              </button>
              
              <div className="text-center space-y-1">
                <p className="text-gray-600 font-medium">Contact: Fasil Umair</p>
                <p className="text-sm text-gray-500">WhatsApp ya call for instant order & delivery</p>
                <p className="text-sm text-gray-400">📞 03477027629</p>
              </div>
              
              {/* Additional Info */}
              <div className="border-t pt-4 mt-4 text-xs text-gray-500 space-y-1">
                {product.isFeatured && (
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-500">⭐</span>
                    <span>Featured Product</span>
                  </div>
                )}
                {product.createdAt && (
                  <div>Added: {new Date(product.createdAt).toLocaleDateString()}</div>
                )}
                {product.updatedAt && (
                  <div>Last Updated: {new Date(product.updatedAt).toLocaleDateString()}</div>
                )}
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default ProductDetails;
