import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-primary text-8xl font-bold mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Page Nahi Mila!
        </h1>
        <p className="text-gray-600 mb-8">
          Aapka dhundha gaya page exist nahi karta. Ho sakta hai aapne galat URL enter kiya ho ya page remove ho gaya ho.
        </p>
        
        <div className="space-y-4">
          <Link
            to="/"
            className="block w-full bg-primary hover:bg-primary/80 text-white py-3 px-6 rounded-lg font-semibold transition duration-300"
          >
            Home Page Par Jaeiye
          </Link>
          
          <Link
            to="/products"
            className="block w-full bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition duration-300"
          >
            Products Dekhiye
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-semibold transition duration-300"
          >
            Pichle Page Par Jaeiye
          </button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Agar problem persist kare toh contact kariye: 
            <br />
            <strong>Fasil Umair</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
