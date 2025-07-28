import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function EditProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    discount: '',
    brand: '',
    countInStock: '',
    category: '',
    isFeatured: false,
    isActive: true,
    tags: [],
    specifications: {
      weight: '',
      dimensions: '',
      ingredients: [],
      skinType: '',
      ageRange: ''
    }
  });
  const [categories, setCategories] = useState([]);
  const [imageUrls, setImageUrls] = useState(['']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product details
        const productRes = await axios.get(`${import.meta.env.VITE_API_URL}/products/${id}`);
        setProduct({
          ...productRes.data,
          tags: productRes.data.tags || [],
          specifications: productRes.data.specifications || {
            weight: '',
            dimensions: '',
            ingredients: [],
            skinType: '',
            ageRange: ''
          }
        });
        
        // Set image URLs from product data
        if (productRes.data.images && productRes.data.images.length > 0) {
          const urls = productRes.data.images.map(img => 
            typeof img === 'object' ? img.url : img
          ).filter(url => url);
          setImageUrls(urls.length > 0 ? urls : ['']);
        }

        // Fetch categories
        const categoriesRes = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Fetch error:', error);
        setError('Product ya categories fetch karne mein masla hua!');
      }
    };
    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSpecificationChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [name]: value
      }
    }));
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setProduct(prev => ({
      ...prev,
      tags
    }));
  };

  const handleIngredientsChange = (e) => {
    const ingredients = e.target.value.split(',').map(ing => ing.trim()).filter(ing => ing);
    setProduct(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        ingredients
      }
    }));
  };

  // Image URL handlers
  const handleImageUrlChange = (index, value) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  const addImageUrl = () => {
    setImageUrls([...imageUrls, '']);
  };

  const removeImageUrl = (index) => {
    if (imageUrls.length > 1) {
      const newUrls = imageUrls.filter((_, i) => i !== index);
      setImageUrls(newUrls);
    }
  };

  const getImagePreview = (url) => {
    if (!url || !url.startsWith('http')) {
      return `https://via.placeholder.com/300x200/e2e8f0/64748b?text=${encodeURIComponent('Add Image URL')}`;
    }
    return url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token nahi mila. Please login again.');
        navigate('/admin/login');
        return;
      }

      // Prepare data for update including images
      const validImageUrls = imageUrls.filter(url => url && url.trim() !== '');
      const updateData = {
        name: product.name,
        description: product.description,
        price: parseFloat(product.price),
        originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : undefined,
        discount: product.discount ? parseFloat(product.discount) : 0,
        brand: product.brand,
        countInStock: parseInt(product.countInStock),
        category: product.category,
        isFeatured: product.isFeatured,
        isActive: product.isActive,
        tags: product.tags,
        specifications: product.specifications,
        images: validImageUrls
      };

      console.log('Updating product with data:', updateData);

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/products/${id}`, 
        updateData,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Update response:', response.data);
      setSuccess('Product successfully update ho gaya!');
      
      // Navigate back to dashboard after a short delay
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1500);
      
    } catch (error) {
      console.error('Update error:', error);
      if (error.response?.status === 401) {
        setError('Authentication failed. Please login again.');
        navigate('/admin/login');
      } else if (error.response?.status === 403) {
        setError('Admin access required.');
      } else {
        setError(error.response?.data?.message || 'Product update karne mein masla hua!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-500 text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Edit Product</h1>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Brand *</label>
                <input
                  type="text"
                  name="brand"
                  value={product.brand}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Description *</label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Price Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Price (Rs) *</label>
                <input
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Original Price (Rs)</label>
                <input
                  type="number"
                  name="originalPrice"
                  value={product.originalPrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={product.discount}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Inventory and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Stock Quantity *</label>
                <input
                  type="number"
                  name="countInStock"
                  value={product.countInStock}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Category *</label>
                <select
                  name="category"
                  value={product.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Tags (comma separated)</label>
              <input
                type="text"
                value={product.tags.join(', ')}
                onChange={handleTagsChange}
                placeholder="e.g., organic, anti-aging, moisturizer"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Product Images */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📸 Product Images</h3>
              <div className="space-y-4">
                {imageUrls.map((url, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                    {/* Image Preview */}
                    <div className="flex-shrink-0">
                      <img
                        src={getImagePreview(url)}
                        alt={`Preview ${index + 1}`}
                        className="w-24 h-24 object-cover rounded-lg border"
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/100x100/e2e8f0/64748b?text=Image+${index + 1}`;
                        }}
                      />
                    </div>
                    
                    {/* URL Input */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Image URL {index + 1}
                      </label>
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => handleImageUrlChange(index, e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => removeImageUrl(index)}
                      disabled={imageUrls.length === 1}
                      className={`px-3 py-2 rounded-md font-medium transition-colors ${
                        imageUrls.length === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      🗑️ Remove
                    </button>
                  </div>
                ))}
                
                {/* Add Image Button */}
                <button
                  type="button"
                  onClick={addImageUrl}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                >
                  ➕ Add Another Image URL
                </button>
                
                <div className="text-sm text-gray-500">
                  💡 <strong>Tip:</strong> Use direct image URLs from services like Imgur, Cloudinary, or other image hosting services.
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Weight</label>
                  <input
                    type="text"
                    name="weight"
                    value={product.specifications.weight}
                    onChange={handleSpecificationChange}
                    placeholder="e.g., 50ml, 100g"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Dimensions</label>
                  <input
                    type="text"
                    name="dimensions"
                    value={product.specifications.dimensions}
                    onChange={handleSpecificationChange}
                    placeholder="e.g., 10cm x 5cm x 3cm"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Skin Type</label>
                  <select
                    name="skinType"
                    value={product.specifications.skinType}
                    onChange={handleSpecificationChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Skin Type</option>
                    <option value="all">All Skin Types</option>
                    <option value="dry">Dry Skin</option>
                    <option value="oily">Oily Skin</option>
                    <option value="combination">Combination Skin</option>
                    <option value="sensitive">Sensitive Skin</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Age Range</label>
                  <input
                    type="text"
                    name="ageRange"
                    value={product.specifications.ageRange}
                    onChange={handleSpecificationChange}
                    placeholder="e.g., 18-65, All Ages"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-gray-700 font-semibold mb-2">Ingredients (comma separated)</label>
                <textarea
                  value={product.specifications.ingredients.join(', ')}
                  onChange={handleIngredientsChange}
                  rows="3"
                  placeholder="e.g., Water, Glycerin, Hyaluronic Acid"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Status Options */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Status</h3>
              <div className="flex space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={product.isActive}
                    onChange={handleInputChange}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-gray-700">Product Active</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={product.isFeatured}
                    onChange={handleInputChange}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-gray-700">Featured Product</span>
                </label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="border-t pt-6">
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition duration-300 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Updating...' : 'Update Product'}
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate('/admin/dashboard')}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 px-6 rounded-lg font-semibold transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProduct;