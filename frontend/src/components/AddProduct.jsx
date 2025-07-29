import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function AddProduct() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [categories, setCategories] = useState([]);
  const [imageUrls, setImageUrls] = useState(['']);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories`);
        setCategories(response.data);
        console.log('Categories loaded:', response.data);
      } catch (error) {
        console.error('Categories load nahi hue:', error);
        setError('Categories load nahi ho saki!');
      }
    };
    fetchCategories();
  }, []);

  const addImageUrl = () => {
    setImageUrls([...imageUrls, '']);
  };

  const updateImageUrl = (index, url) => {
    const newUrls = [...imageUrls];
    newUrls[index] = url;
    setImageUrls(newUrls);
  };

  const removeImageUrl = (index) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls.length > 0 ? newUrls : ['']);
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
  };

  // Upload images to Cloudinary
  const uploadImagesToCloudinary = async () => {
    if (imageFiles.length === 0) return [];
    
    setUploadingImages(true);
    const uploadedUrls = [];
    
    try {
      const token = localStorage.getItem('token');
      
      for (const file of imageFiles) {
        const formData = new FormData();
        formData.append('images', file);
        
        const response = await axios.post(`${API_URL}/products/upload`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (response.data.imageUrls && response.data.imageUrls.length > 0) {
          uploadedUrls.push(...response.data.imageUrls);
        }
      }
      
      return uploadedUrls;
    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error('Images upload nahi ho sake');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Process image URLs
    const validImageUrls = imageUrls.filter(url => url.trim() !== '').map(url => ({
      url: url.trim(),
      alt: name
    }));

    // Validation
    if (!name.trim() || !description.trim() || !price || !brand.trim() || !category || !countInStock) {
      setError('Sab fields fill karna zaroori hai!');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Login pehle karo! Token missing hai.');
        setLoading(false);
        return;
      }

      // Create product data
      const productData = {
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : parseFloat(price),
        brand: brand.trim(),
        category: category,
        countInStock: parseInt(countInStock),
        images: validImageUrls
      };

      console.log('Sending product data:', productData);

      const response = await axios.post(`${API_URL}/products`, productData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      console.log('Product added successfully:', response.data);
      setSuccess('Product successfully add ho gaya!');
      
      // Reset form
      setName('');
      setDescription('');
      setPrice('');
      setOriginalPrice('');
      setBrand('');
      setCategory('');
      setCountInStock('');
      setImageUrls(['']);
      
      // Navigate after 2 seconds
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Product add error:', error);
      if (error.response) {
        setError(`Error: ${error.response.data.message || 'Product add nahi hua'}`);
      } else if (error.request) {
        setError('Server se connection nahi ban saka!');
      } else {
        setError('Kuch ghalat hua, dobara try karo!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold justify-center items-center text-gray-800 mb-6">Add Product</h1>
        {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">{success}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Product Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Product ka naam enter karo"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Brand *</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Brand name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Product ka detail description"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary h-32"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Price (Rs) *</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Selling price"
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Original Price (Rs)</label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="MRP price (optional)"
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Stock Quantity *</label>
              <input
                type="number"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
                placeholder="Available quantity"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Product Images */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Product Images</label>
            
            {/* File Upload Section */}
            <div className="mb-4 p-4 border-2 border-dashed border-blue-300 rounded-lg">
              <div className="text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="mb-3"
                  id="imageFiles"
                />
                <label htmlFor="imageFiles" className="block text-sm text-gray-600 mb-2">
                  📁 Select images from your computer (Multiple files allowed)
                </label>
                {imageFiles.length > 0 && (
                  <div className="text-sm text-green-600 mb-2">
                    ✅ {imageFiles.length} file(s) selected
                  </div>
                )}
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const uploadedImages = await uploadImagesToCloudinary();
                      if (uploadedImages.length > 0) {
                        const newUrls = uploadedImages.map(img => img.url);
                        setImageUrls(prev => [...prev.filter(url => url.trim() !== ''), ...newUrls]);
                        setSuccess(`${uploadedImages.length} images uploaded successfully!`);
                        setImageFiles([]);
                        document.getElementById('imageFiles').value = '';
                      }
                    } catch (error) {
                      setError(error.message);
                    }
                  }}
                  disabled={imageFiles.length === 0 || uploadingImages}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    imageFiles.length === 0 || uploadingImages
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {uploadingImages ? '⏳ Uploading...' : '☁️ Upload to Cloudinary'}
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>
            
            {/* URL Input Section */}
            <div className="space-y-3 mt-4">
              <h4 className="text-sm font-medium text-gray-700">Add Image URLs manually:</h4>
              {imageUrls.map((url, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => updateImageUrl(index, e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => removeImageUrl(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    disabled={imageUrls.length === 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addImageUrl}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                + Add Another URL
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">💡 You can either upload files directly or enter image URLs</p>
            
            {/* Image Previews */}
            {imageUrls.filter(url => url.trim() !== '').length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Image Preview:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {imageUrls.filter(url => url.trim() !== '').map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border shadow-sm"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkludmFsaWQgVVJMPC90ZXh0Pjwvc3ZnPg==';
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg truncate">
                        Image {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-semibold transition duration-300 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Adding Product...' : 'Add Product'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg font-semibold transition duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
