"use client";

import React, { useState, useEffect } from 'react';
import { useGetUserByIdQuery, useUpdateUserMutation } from '@/store/api/userApi';
import { X, Save, User, Mail, Phone, Building, Calendar, Shield, CheckCircle, XCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

interface UserDetailModalProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({ userId, isOpen, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: '',
    isEmailVerified: false,
    companyName: ''
  });

  const { data: user, isLoading, error } = useGetUserByIdQuery(userId || '', {
    skip: !userId || !isOpen
  });

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        status: user.status || '',
        isEmailVerified: user.isEmailVerified || false,
        companyName: user.companyName || ''
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSave = async () => {
    if (!userId) return;

    try {
      await updateUser({
        userId,
        ...formData
      }).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        status: user.status || '',
        isEmailVerified: user.isEmailVerified || false,
        companyName: user.companyName || ''
      });
    }
    setIsEditing(false);
  };

  if (!isOpen || !userId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">User Details</h2>
              <p className="text-sm text-gray-600">View and manage user information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600">Failed to load user details</p>
            </div>
          ) : user ? (
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none"
                      />
                    ) : (
                      <p className="text-gray-900">{user.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <p className="text-gray-900">{user.email}</p>
                        {user.isEmailVerified ? (
                          <CheckCircle className="w-4 h-4 text-success" />
                        ) : (
                          <XCircle className="w-4 h-4 text-error" />
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none"
                      />
                    ) : (
                      <p className="text-gray-900">{user.phone || 'Not provided'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none"
                      />
                    ) : (
                      <p className="text-gray-900">{user.companyName || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Status */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    {isEditing ? (
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none"
                      >
                        <option value="verified">Verified</option>
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === 'verified' ? 'bg-success/10 text-success' :
                        user.status === 'pending' ? 'bg-warning/10 text-warning' :
                        user.status === 'rejected' ? 'bg-error/10 text-error' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'agency' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Verified</label>
                    {isEditing ? (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="isEmailVerified"
                          checked={formData.isEmailVerified}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Email is verified</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        {user.isEmailVerified ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-success" />
                            <span className="text-success text-sm">Verified</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-error" />
                            <span className="text-error text-sm">Unverified</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
                    <p className="text-gray-900">{new Date(user.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Account Statistics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Member Since</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Last Updated</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {new Date(user.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">User ID</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 mt-1 font-mono">
                      {user.id}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isUpdating}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isUpdating ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors flex items-center"
            >
              <User className="w-4 h-4 mr-2" />
              Edit User
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
