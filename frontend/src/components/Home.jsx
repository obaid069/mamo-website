import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-pink-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-indigo-300/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-pink-400/10 rounded-full blur-2xl animate-pulse delay-3000"></div>
      </div>
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Hero Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-indigo-400/20">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '50px 50px' }}></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            {/* Main Title */}
            <div className="mb-8">
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 bg-clip-text text-transparent mb-4 drop-shadow-lg">
                ✨ AI Cosmetics ✨
              </h1>
              <p className="text-2xl md:text-3xl text-gray-700 font-light">
                Your Beauty, Our Passion
              </p>
            </div>
            
            {/* Main Content Card */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 max-w-4xl mx-auto border border-white/50">
              <div className="flex flex-col md:flex-row items-center justify-between mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 md:mb-0">
                  🌸 Hamari Dukan Ke Bare Mein
                </h2>
                <div className="text-6xl md:text-8xl">
                  💄
                </div>
              </div>
              
              <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
                <span className="font-semibold text-purple-700">Assalam o alaikum!</span> AI Cosmetics mein aap ko khush amdeed. 
                Yahan aap ko sabse behtar aur original cosmetic products milenge. 
                Hamara maqsad hai ke har aurat ki khoobsurti aur confidence badhaye.
              </p>
              
              {/* Features Grid */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-pink-100 to-pink-200 p-6 rounded-2xl border border-pink-200 hover:shadow-lg transition-all duration-300">
                  <div className="text-3xl mb-3">🌟</div>
                  <h3 className="font-bold text-pink-700 mb-2 text-lg">Quality Products</h3>
                  <p className="text-gray-600">Sirf original aur tested products</p>
                </div>
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-2xl border border-purple-200 hover:shadow-lg transition-all duration-300">
                  <div className="text-3xl mb-3">💰</div>
                  <h3 className="font-bold text-purple-700 mb-2 text-lg">Best Prices</h3>
                  <p className="text-gray-600">Affordable rates mein best quality</p>
                </div>
                <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 p-6 rounded-2xl border border-indigo-200 hover:shadow-lg transition-all duration-300">
                  <div className="text-3xl mb-3">🚚</div>
                  <h3 className="font-bold text-indigo-700 mb-2 text-lg">Fast Delivery</h3>
                  <p className="text-gray-600">Quick aur safe delivery</p>
                </div>
              </div>
              
              {/* Owner Info */}
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-2xl mb-8 border border-yellow-200">
                <p className="text-xl font-bold text-orange-800 flex items-center justify-center">
                  <span className="text-2xl mr-3">👑</span>
                  Owner: Fasil Umair
                  <span className="text-2xl ml-3">👑</span>
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-6">
                <Link 
                  to="/products"
                  className="flex-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white px-8 py-4 rounded-2xl text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <span className="text-2xl mr-3">🛍️</span>
                  Products Dekhiye
                  <span className="text-2xl ml-3">✨</span>
                </Link>
                <Link 
                  to="/admin/login"
                  className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-4 rounded-2xl text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <span className="text-2xl mr-3">🔐</span>
                  Admin Login
                  <span className="text-2xl ml-3">⚙️</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Beauty Tips Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-6">💅 Beauty Tips 💅</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl">
              <div className="text-4xl mb-4">🌙</div>
              <h4 className="font-bold mb-2">Night Care</h4>
              <p className="text-sm">Raat ko proper skincare routine follow karein</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl">
              <div className="text-4xl mb-4">☀️</div>
              <h4 className="font-bold mb-2">Sun Protection</h4>
              <p className="text-sm">Dhoop se bachne ke liye sunscreen zaroori hai</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl">
              <div className="text-4xl mb-4">💧</div>
              <h4 className="font-bold mb-2">Hydration</h4>
              <p className="text-sm">Paani zyada piyen aur moisturizer use karein</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;