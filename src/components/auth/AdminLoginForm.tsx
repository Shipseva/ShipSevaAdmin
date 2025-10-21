"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useAdminLoginMutation } from '@/store/api/authApi';
import { setAdmin } from '@/store/slices/adminSlice';
import { setAdminAuthData } from '@/lib/auth';
import { Eye, EyeOff, Shield, User, Lock, ArrowRight } from 'lucide-react';

const AdminLoginForm: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [adminLogin, { isLoading, error }] = useAdminLoginMutation();
  
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.identifier) {
      newErrors.identifier = 'Email or phone number is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.identifier) && !/^\d{10}$/.test(formData.identifier)) {
      newErrors.identifier = 'Please enter a valid email or 10-digit phone number';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const loginPayload = {
        ...formData,
        queryType: 'adminPanel'
      };
      
      const response = await adminLogin(loginPayload).unwrap();
      
      // Save auth data to localStorage
      setAdminAuthData(response.token, response.user);
      
      // Update Redux state
      dispatch(setAdmin({ admin: response.user, token: response.token }));
      
      router.push('/admin');
    } catch (error: any) {
      console.error('Login error:', error);
      // Error handling is now done by baseQuery
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-accent flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">ShipSeva Admin</h1>
          <p className="text-white/80">Welcome to the admin dashboard</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Sign In</h2>
            <p className="text-gray-600">Enter your admin credentials to access the panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email or Phone Field */}
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-2">
                Email or Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  required
                  value={formData.identifier}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-colors ${
                    errors.identifier ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your email or phone number"
                />
              </div>
              {errors.identifier && (
                <p className="mt-1 text-sm text-red-600">{errors.identifier}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-colors ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                className="text-sm text-primary hover:text-primary-light transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">
                  Login failed. Please check your credentials and try again.
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-accent text-white py-3 px-4 rounded-lg font-medium hover:from-primary-light hover:to-accent-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/60 text-sm">
            © 2024 ShipSeva Admin. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginForm;