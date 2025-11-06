"use client";

import React, { useState, useEffect } from 'react';
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useBanUserMutation,
  useUnbanUserMutation,
  useUpdateUserMutation,
} from '@/store/api/userApi';
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Ban,
  UserCheck,
  Download,
  Plus,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Trash2,
  UserX,
  RefreshCw
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import UserDetailModal from '@/components/users/UserDetailModal';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'individual' | 'agency' | 'admin';
  status: 'pending' | 'verified' | 'rejected';
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  companyName?: string;
}

interface FilterState {
  email: string;
  companyName: string;
  status: string;
  isEmailVerified: boolean | null;
  role: string;
  limit: number;
  page: number;
  sortBy: 'createdAt';
  sortOrder: 'ASC' | 'DESC';
}

const UsersPage: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    email: '',
    companyName: '',
    status: '',
    isEmailVerified: null,
    role: '',
    limit: 10,
    page: 1,
    sortBy: 'createdAt',
    sortOrder: 'DESC'
  });

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Create filtered params for API call
  const getFilteredParams = () => {
    const filteredParams: any = {};
    
    // Only search by email for now
    if (filters.email) filteredParams.email = filters.email;
    if (filters.status) filteredParams.status = filters.status;
    if (filters.role) filteredParams.role = filters.role;
    if (filters.isEmailVerified !== null) filteredParams.isEmailVerified = filters.isEmailVerified;
    if (filters.limit) filteredParams.limit = filters.limit;
    if (filters.page) filteredParams.page = filters.page;
    if (filters.sortBy) filteredParams.sortBy = filters.sortBy;
    if (filters.sortOrder) filteredParams.sortOrder = filters.sortOrder;
    
    return filteredParams;
  };

  // API calls
  const { 
    data: usersData, 
    isLoading, 
    error, 
    refetch 
  } = useGetAllUsersQuery(getFilteredParams());

  const [deleteUser] = useDeleteUserMutation();
  const [banUser] = useBanUserMutation();
  const [unbanUser] = useUnbanUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const users = usersData?.users || [];
  const totalRecords = usersData?.totalRecords || 0;
  const currentPage = usersData?.currentPage || 1;
  const totalPages = usersData?.totalPages || 1;

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({
      ...prev,
      email: searchTerm,
      page: 1
    }));
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId).unwrap();
        refetch();
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const handleBanUser = async (userId: string, reason?: string) => {
    try {
      await banUser({ id: userId, reason }).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to ban user:', error);
    }
  };

  const handleUnbanUser = async (userId: string) => {
    try {
      await unbanUser(userId).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to unban user:', error);
    }
  };

  const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
    try {
      await updateUser({ userId, ...updates }).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleBulkAction = async (action: 'verify' | 'reject' | 'delete') => {
    if (selectedUsers.length === 0) return;

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${selectedUsers.length} user(s)?`
    );

    if (!confirmed) return;

    try {
      for (const userId of selectedUsers) {
        switch (action) {
          case 'verify':
            await updateUser({ userId, status: 'verified' }).unwrap();
            break;
          case 'reject':
            await updateUser({ userId, status: 'rejected' }).unwrap();
            break;
          case 'delete':
            await deleteUser(userId).unwrap();
            break;
        }
      }
      setSelectedUsers([]);
      refetch();
    } catch (error) {
      console.error(`Failed to ${action} users:`, error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "verified":
        return "bg-success/10 text-success";
      case "pending":
        return "bg-warning/10 text-warning";
      case "rejected":
        return "bg-error/10 text-error";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "agency":
        return "bg-blue-100 text-blue-800";
      case "individual":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-5 h-5 animate-spin text-primary" />
            <span className="text-gray-600">Loading users...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
            <p className="text-gray-600">Manage and monitor platform users</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => refetch()}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light transition-colors flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalRecords}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users by email..."
                value={filters.email}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none"
            >
              <option value="">All Roles</option>
              <option value="individual">Individual</option>
              <option value="agency">Agency</option>
              <option value="admin">Admin</option>
            </select>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none"
            >
              <option value="">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={filters.isEmailVerified === null ? '' : filters.isEmailVerified.toString()}
              onChange={(e) => handleFilterChange('isEmailVerified', e.target.value === '' ? null : e.target.value === 'true')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none"
            >
              <option value="">All Email Status</option>
              <option value="true">Verified</option>
              <option value="false">Unverified</option>
            </select>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            >
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={filters.email}
                  onChange={(e) => handleFilterChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none"
                  placeholder="Filter by email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={filters.companyName || ''}
                  onChange={(e) => handleFilterChange('companyName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none"
                  placeholder="Filter by company name"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div className="flex gap-2">
                <select
                  value={filters.limit}
                  onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none"
                >
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                  <option value={100}>100 per page</option>
                </select>
                <select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    handleFilterChange('sortBy', sortBy);
                    handleFilterChange('sortOrder', sortOrder);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none"
                >
                  <option value="createdAt-DESC">Newest First</option>
                  <option value="createdAt-ASC">Oldest First</option>
                </select>
              </div>
              <button
                onClick={() => setFilters({
                  email: '', companyName: '', status: '', isEmailVerified: null, role: '',
                  limit: 10, page: 1, sortBy: 'createdAt', sortOrder: 'DESC'
                })}
                className="text-primary hover:text-primary-light text-sm font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-blue-700 font-medium">
              {selectedUsers.length} user(s) selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('verify')}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors"
              >
                Verify Selected
              </button>
              <button
                onClick={() => handleBulkAction('reject')}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors"
              >
                Reject Selected
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors"
              >
                Delete Selected
              </button>
              <button
                onClick={() => setSelectedUsers([])}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {error ? (
          <div className="p-8 text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-red-700">Failed to load users. Please try again.</span>
              </div>
              <button
                onClick={() => refetch()}
                className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === users.length && users.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(users.map(user => user.id));
                        } else {
                          setSelectedUsers([]);
                        }
                      }}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email Verified
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <Users className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="text-lg font-medium text-gray-900 mb-2">No users found</p>
                        <p className="text-gray-500">Try adjusting your filters or search terms</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers(prev => [...prev, user.id]);
                            } else {
                              setSelectedUsers(prev => prev.filter(id => id !== user.id));
                            }
                          }}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          {user.phone && (
                            <div className="text-xs text-gray-400">{user.phone}</div>
                          )}
                          {user.companyName && (
                            <div className="text-xs text-gray-400">{user.companyName}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {user.isEmailVerified ? (
                            <CheckCircle className="w-4 h-4 text-success" />
                          ) : (
                            <XCircle className="w-4 h-4 text-error" />
                          )}
                          <span className="ml-1 text-sm text-gray-600">
                            {user.isEmailVerified ? 'Verified' : 'Unverified'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => {
                              setSelectedUserId(user.id);
                              setShowUserModal(true);
                            }}
                            className="text-gray-400 hover:text-primary transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {user.status === 'pending' ? (
                            <button 
                              onClick={() => handleUpdateUser(user.id, { status: 'verified' })}
                              className="text-gray-400 hover:text-success transition-colors"
                              title="Verify User"
                            >
                              <UserCheck className="w-4 h-4" />
                            </button>
                          ) : user.status === 'verified' ? (
                            <button 
                              onClick={() => handleUpdateUser(user.id, { status: 'rejected' })}
                              className="text-gray-400 hover:text-error transition-colors"
                              title="Reject User"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleUpdateUser(user.id, { status: 'verified' })}
                              className="text-gray-400 hover:text-success transition-colors"
                              title="Verify User"
                            >
                              <UserCheck className="w-4 h-4" />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-gray-400 hover:text-error transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600 transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination - Only show when no error */}
        {!error && (
          <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-700">
              <span>
                Showing {((currentPage - 1) * filters.limit) + 1} to {Math.min(currentPage * filters.limit, totalRecords)} of {totalRecords} results
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handleFilterChange('page', Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 bg-primary text-white rounded-lg text-sm">
                {currentPage}
              </span>
              <button 
                onClick={() => handleFilterChange('page', currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      <UserDetailModal
        userId={selectedUserId}
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setSelectedUserId(null);
        }}
      />
    </div>
  );
};

export default UsersPage;