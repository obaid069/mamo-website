import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ProductDetails from '../components/ProductDetails';
import { handleApiError, validateProductId } from '../utils/errorHandler';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  const fetchProduct = async (isRetry = false) => {
    try {
      if (isRetry) {
        setError('');
        setLoading(true);
      }
      
      // Validate ID format using utility
      const validation = validateProductId(id);
      if (!validation.valid) {
        setError(validation.error);
        setLoading(false);
        return;
      }

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/products/${id}`, {
        timeout: 10000 // 10 second timeout
      });
      
      if (res.data) {
        setProduct(res.data);
        setError('');
      } else {
        setError('Product data nahi mila');
      }
    } catch (error) {
      const errorMessage = handleApiError(error, 'ProductDetailPage - fetchProduct');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchProduct(true);
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-primary text-white py-4">
          <div className="container mx-auto px-4">
            <Link to="/products" className="text-white hover:text-gray-200">
              ← Products List
            </Link>
          </div>
        </div>
        <div className="container mx-auto px-4 py-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="animate-pulse">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <div className="h-96 bg-gray-300 rounded-lg mb-4"></div>
                </div>
                <div className="md:w-1/2 md:pl-8">
                  <div className="h-8 bg-gray-300 rounded mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded mb-6 w-1/3"></div>
                  <div className="space-y-2 mb-6">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center text-gray-500 mt-4">
              Product details load ho rahe hain...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-primary text-white py-4">
          <div className="container mx-auto px-4">
            <Link to="/products" className="text-white hover:text-gray-200">
              ← Products List
            </Link>
          </div>
        </div>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Product Load Nahi Hua
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            
            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full bg-primary hover:bg-primary/80 text-white py-3 px-6 rounded-lg font-semibold transition duration-300"
                disabled={loading}
              >
                {loading ? 'Retry Ho Raha Hai...' : 'Dubara Try Kariye'}
              </button>
              
              <Link
                to="/products"
                className="block w-full bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition duration-300"
              >
                Products List Par Jaeiye
              </Link>
              
              <button
                onClick={() => navigate('/')}
                className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-semibold transition duration-300"
              >
                Home Page Par Jaeiye
              </button>
            </div>
            
            {retryCount > 0 && (
              <p className="text-sm text-gray-500 mt-4">
                Retry attempts: {retryCount}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary text-white py-4">
        <div className="container mx-auto px-4">
          <Link to="/products" className="text-white hover:text-gray-200">
            ← Products List
          </Link>
        </div>
      </div>
      <ProductDetails product={product} />
    </div>
  );
}

export default ProductDetailPage;