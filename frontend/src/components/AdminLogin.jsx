import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL|| 'http://localhost:5000/api';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setError('Email aur password dono zaroori hain!');
      setLoading(false);
      return;
    }

    // Clear any existing malformed tokens
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    try {
      console.log('Attempting login with:', { email, password: '***' });
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      
      if (res.data.token) {
        // Validate token format before storing
        const tokenParts = res.data.token.split('.');
        if (tokenParts.length === 3) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data));
          console.log('Login successful, navigating to dashboard');
          navigate('/admin/dashboard');
        } else {
          setError('Invalid token format received from server!');
        }
      } else {
        setError('Login response mein token nahi mila!');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (!err.response) {
        setError('Server se connection nahi ban saka! Server running hai?');
      } else if (err.response.status === 401) {
        setError('Galat email ya password! New Admin credentials: admin@aicosmetics.com / !AI_Cosmetics@786');
      } else if (err.response.status === 404) {
        setError('Login endpoint nahi mila! Backend routes check karein.');
      } else {
        setError(`Server error: ${err.response.data.message || 'Kuch ghalat hua'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-primary">Admin Sign In</h2>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@aicosmetics.com"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-semibold text-gray-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin123"
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878l4.244 4.244"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-primary hover:bg-gray-700 bg-gray-600 text-white font-semibold py-2 rounded transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-primary hover:text-gray-700 underline"
          >
            ← Back to Home
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminLogin;