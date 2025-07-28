import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
        setProducts(res.data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Products fetch karne mein masla hua!');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-pink-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-indigo-300/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white py-16 shadow-2xl overflow-hidden">
        {/* Header Background Pattern */}
        <div className="absolute inset-0 bg-black/10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-2xl animate-fade-in">
                ✨ AI Cosmetics Collection ✨
              </h1>
              <p className="text-xl md:text-2xl text-pink-100 mb-6 max-w-2xl mx-auto leading-relaxed">
                Discover Beautiful Products for Your Beauty Journey
              </p>
              <div className="flex justify-center items-center space-x-4 text-3xl animate-bounce">
                <span>💄</span>
                <span>💅</span>
                <span>💎</span>
                <span>👑</span>
              </div>
            </div>
            
            <Link 
              to="/" 
              className="inline-flex items-center bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-full transition-all duration-300 backdrop-blur-sm border-2 border-white/30 hover:border-white/50 transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-semibold">Back to Home</span>
            </Link>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 text-6xl animate-float opacity-30">🌸</div>
        <div className="absolute bottom-20 right-10 text-6xl animate-float opacity-30" style={{ animationDelay: '1s' }}>🌺</div>
        <div className="absolute top-1/2 left-20 text-4xl animate-float opacity-30" style={{ animationDelay: '2s' }}>✨</div>
      </div>

      {/* Search & Filter Section */}
      <div className="relative bg-white/90 backdrop-blur-md border-b border-pink-200 py-8 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-pink-100">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              {/* Products Count */}
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-3 rounded-full">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    Our Products
                  </h2>
                  <p className="text-gray-600">{products.length} beautiful items available</p>
                </div>
              </div>
              
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                {/* Search Input */}
                <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="Search for beauty products..." 
                    className="w-full sm:w-64 px-5 py-3 pl-12 border-2 border-pink-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-400/20 focus:border-pink-400 bg-white/90 backdrop-blur-sm transition-all duration-300 group-hover:shadow-lg"
                  />
                  <svg className="w-5 h-5 text-pink-400 absolute left-4 top-4 group-focus-within:text-pink-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                {/* Category Filter */}
                <div className="relative group">
                  <select className="w-full sm:w-48 px-5 py-3 pr-10 border-2 border-purple-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-400/20 focus:border-purple-400 bg-white/90 backdrop-blur-sm appearance-none cursor-pointer transition-all duration-300 group-hover:shadow-lg">
                    <option value="">All Categories 🌟</option>
                    <option value="skincare">Skincare 🧴</option>
                    <option value="makeup">Makeup 💄</option>
                    <option value="fragrance">Fragrance 🌸</option>
                    <option value="haircare">Hair Care 💇‍♀️</option>
                  </select>
                  <svg className="w-5 h-5 text-purple-400 absolute right-4 top-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-10">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 text-center">
            <span className="font-medium">Oops! </span>{error}
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4 animate-bounce">🔄</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">Loading Products...</h3>
            <p className="text-gray-500">Please wait while we fetch amazing products for you!</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛍️</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Products Available</h3>
            <p className="text-gray-500">Check back soon for amazing cosmetic products!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Footer Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-2">AI Cosmetics</h3>
          <p className="text-gray-300 mb-4">Your Beauty, Our Passion ✨</p>
          <div className="flex justify-center space-x-6">
            <span className="text-pink-400">💄</span>
            <span className="text-purple-400">💅</span>
            <span className="text-indigo-400">💍</span>
            <span className="text-pink-400">👑</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;