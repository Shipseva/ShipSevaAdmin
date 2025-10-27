"use client";

import React, { useState, useEffect } from 'react';
import {
  useGetAllKycQuery,
  useDeleteKycMutation,
  useApproveKycMutation,
  useRejectKycMutation,
  useUpdateDocumentStatusMutation,
  useGetKycStatsQuery
} from '@/store/api/kycApi';
import {
  FileText,
  Search,
  Filter,
  MoreVertical,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  RefreshCw,
  User,
  Building,
  Shield,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import KYCDetailModal from '@/components/kyc/KYCDetailModal';

interface KYCApplication {
  id: string;
  user: {
    id: string;
    name: string;
    phone: string;
    email: string;
    role: 'individual' | 'agency' | 'admin';
    status: 'pending' | 'verified' | 'rejected';
  };
  aadhar?: {
    aadharNumber: string;
    aadharFront: string;
    aadharBack: string;
    documentStatus: 'pending' | 'verified' | 'rejected';
  };
  pan?: {
    panNumber: string;
    panFront: string;
    panBack: string;
    documentStatus: 'pending' | 'verified' | 'rejected';
  };
  ifsc?: string;
  accountNumber?: string;
  accountHolderName?: string;
  bankName?: string;
  branchName?: string;
  gstNumber?: string;
  gstCertificate?: string;
  businessType: 'individual' | 'company' | 'partnership' | 'llp' | 'trust' | 'other';
  status: 'pending' | 'verified' | 'rejected';
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  priority?: 'high' | 'normal';
  reviewer?: string;
}

interface FilterState {
  name: string;
  status: string;
  businessType: string;
  aadharVerified: boolean | null;
  panVerified: boolean | null;
  limit: number;
  page: number;
  sortBy: 'createdAt' | 'status' | 'businessType';
  sortOrder: 'ASC' | 'DESC';
}

const KYCPage: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    name: '',
    status: '',
    businessType: '',
    aadharVerified: null,
    panVerified: null,
    limit: 10,
    page: 1,
    sortBy: 'createdAt',
    sortOrder: 'DESC'
  });

  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedKycId, setSelectedKycId] = useState<string | null>(null);
  const [showKycModal, setShowKycModal] = useState(false);

  // Create filtered params for API call
  const getFilteredParams = () => {
    const filteredParams: any = {};
    
    if (filters.name) filteredParams.name = filters.name;
    if (filters.status) filteredParams.status = filters.status;
    if (filters.businessType) filteredParams.businessType = filters.businessType;
    if (filters.aadharVerified !== null) filteredParams.aadharVerified = filters.aadharVerified;
    if (filters.panVerified !== null) filteredParams.panVerified = filters.panVerified;
    if (filters.limit) filteredParams.limit = filters.limit;
    if (filters.page) filteredParams.page = filters.page;
    if (filters.sortBy) filteredParams.sortBy = filters.sortBy;
    if (filters.sortOrder) filteredParams.sortOrder = filters.sortOrder;
    
    return filteredParams;
  };

  // API calls
  const { 
    data: kycData, 
    isLoading, 
    isFetching,
    error, 
    refetch 
  } = useGetAllKycQuery(getFilteredParams());

  const { data: statsData } = useGetKycStatsQuery();
  const [deleteKyc] = useDeleteKycMutation();
  const [approveKyc] = useApproveKycMutation();
  const [rejectKyc] = useRejectKycMutation();
  const [updateDocumentStatus] = useUpdateDocumentStatusMutation();

  const kycApplications = kycData?.data || [];
  const totalRecords = kycData?.totalRecords || 0;
  const currentPage = kycData?.currentPage || 1;
  const totalPages = kycData?.totalPages || 1;
  
  const stats = statsData || {
    total: 0,
    pending: 0,
    verified: 0,
    rejected: 0,
    highPriority: 0
  };

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
      name: searchTerm,
      page: 1
    }));
  };

  const handleDeleteKyc = async (kycId: string) => {
    if (window.confirm('Are you sure you want to delete this KYC application?')) {
      try {
        await deleteKyc(kycId).unwrap();
        refetch();
      } catch (error) {
        console.error('Failed to delete KYC:', error);
      }
    }
  };

  const handleApproveKyc = async (kycId: string) => {
    try {
      await approveKyc(kycId).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to approve KYC:', error);
    }
  };

  const handleRejectKyc = async (kycId: string, reason?: string) => {
    try {
      await rejectKyc({ id: kycId, reason }).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to reject KYC:', error);
    }
  };

  const handleUpdateDocumentStatus = async (kycId: string, type: 'aadhar' | 'pan', status: 'pending' | 'verified' | 'rejected') => {
    try {
      await updateDocumentStatus({ id: kycId, type, documentStatus: status }).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to update document status:', error);
    }
  };

  const handleBulkAction = async (action: 'approve' | 'reject' | 'delete') => {
    if (selectedApplications.length === 0) return;

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${selectedApplications.length} KYC application(s)?`
    );

    if (!confirmed) return;

    try {
      for (const kycId of selectedApplications) {
        switch (action) {
          case 'approve':
            await approveKyc(kycId).unwrap();
            break;
          case 'reject':
            await rejectKyc({ id: kycId }).unwrap();
            break;
          case 'delete':
            await deleteKyc(kycId).unwrap();
            break;
        }
      }
      setSelectedApplications([]);
      refetch();
    } catch (error) {
      console.error(`Failed to ${action} KYC applications:`, error);
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

  const getBusinessTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "individual":
        return "bg-blue-100 text-blue-800";
      case "company":
        return "bg-green-100 text-green-800";
      case "partnership":
        return "bg-purple-100 text-purple-800";
      case "llp":
        return "bg-orange-100 text-orange-800";
      case "trust":
        return "bg-pink-100 text-pink-800";
      case "other":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string | undefined) => {
    if (!priority) return "bg-gray-100 text-gray-800";
    
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800";
      case "normal":
        return "bg-gray-100 text-gray-800";
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
            <span className="text-gray-600">Loading KYC applications...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* Loading Overlay */}
      {isFetching && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50 rounded-xl">
          <div className="flex items-center space-x-2 bg-white px-6 py-3 rounded-lg shadow-lg border">
            <RefreshCw className="w-5 h-5 animate-spin text-primary" />
            <span className="text-gray-600 font-medium">Loading KYC applications...</span>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">KYC Management</h1>
            <p className="text-gray-600">Review and manage KYC applications</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => refetch()}
              disabled={isFetching}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
              {isFetching ? 'Refreshing...' : 'Refresh'}
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalRecords}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pending}</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Verified</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.verified}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-50">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.highPriority}</p>
            </div>
            <div className="p-3 rounded-lg bg-red-50">
              <AlertCircle className="w-6 h-6 text-red-600" />
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
                placeholder="Search by user name..."
                value={filters.name}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none"
              />
            </div>
          </div>
          <div className="flex gap-3">
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
              value={filters.businessType}
              onChange={(e) => handleFilterChange('businessType', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none"
            >
              <option value="">All Business Types</option>
              <option value="individual">Individual</option>
              <option value="company">Company</option>
              <option value="partnership">Partnership</option>
              <option value="llp">LLP</option>
              <option value="trust">Trust</option>
              <option value="other">Other</option>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Verified</label>
                <select
                  value={filters.aadharVerified === null ? '' : filters.aadharVerified.toString()}
                  onChange={(e) => handleFilterChange('aadharVerified', e.target.value === '' ? null : e.target.value === 'true')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none"
                >
                  <option value="">All Aadhar Status</option>
                  <option value="true">Verified</option>
                  <option value="false">Not Verified</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PAN Verified</label>
                <select
                  value={filters.panVerified === null ? '' : filters.panVerified.toString()}
                  onChange={(e) => handleFilterChange('panVerified', e.target.value === '' ? null : e.target.value === 'true')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none"
                >
                  <option value="">All PAN Status</option>
                  <option value="true">Verified</option>
                  <option value="false">Not Verified</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    handleFilterChange('sortBy', sortBy);
                    handleFilterChange('sortOrder', sortOrder);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none"
                >
                  <option value="createdAt-DESC">Newest First</option>
                  <option value="createdAt-ASC">Oldest First</option>
                  <option value="status-ASC">Status A-Z</option>
                  <option value="status-DESC">Status Z-A</option>
                </select>
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
              </div>
              <button
                onClick={() => setFilters({
                  name: '', status: '', businessType: '', aadharVerified: null, panVerified: null,
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
      {selectedApplications.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-blue-700 font-medium">
              {selectedApplications.length} KYC application(s) selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('approve')}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors"
              >
                Approve Selected
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
                onClick={() => setSelectedApplications([])}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KYC Applications Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="flex items-center justify-center">
              <RefreshCw className="w-5 h-5 animate-spin text-primary mr-2" />
              <span className="text-gray-600">Loading KYC applications...</span>
            </div>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-red-700">Failed to load KYC applications. Please try again.</span>
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
                      checked={selectedApplications.length === kycApplications.length && kycApplications.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedApplications(kycApplications.map(app => app.id));
                        } else {
                          setSelectedApplications([]);
                        }
                      }}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documents
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {kycApplications.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <FileText className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="text-lg font-medium text-gray-900 mb-2">No KYC applications found</p>
                        <p className="text-gray-500">Try adjusting your filters or search terms</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  kycApplications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedApplications.includes(application.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedApplications(prev => [...prev, application.id]);
                            } else {
                              setSelectedApplications(prev => prev.filter(id => id !== application.id));
                            }
                          }}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{application.user.name}</div>
                          <div className="text-sm text-gray-500">{application.user.email}</div>
                          <div className="text-xs text-gray-400">ID: {application.id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBusinessTypeColor(application.businessType)}`}>
                          {application.businessType.charAt(0).toUpperCase() + application.businessType.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {application.aadhar?.documentStatus === 'verified' ? (
                              <CheckCircle className="w-4 h-4 text-success" />
                            ) : (
                              <XCircle className="w-4 h-4 text-error" />
                            )}
                            <span className="ml-1 text-xs text-gray-600">Aadhar</span>
                          </div>
                          <div className="flex items-center">
                            {application.pan?.documentStatus === 'verified' ? (
                              <CheckCircle className="w-4 h-4 text-success" />
                            ) : (
                              <XCircle className="w-4 h-4 text-error" />
                            )}
                            <span className="ml-1 text-xs text-gray-600">PAN</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(application.priority)}`}>
                          {application.priority ? application.priority.charAt(0).toUpperCase() + application.priority.slice(1) : 'Normal'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(application.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => {
                              setSelectedKycId(application.id);
                              setShowKycModal(true);
                            }}
                            className="text-gray-400 hover:text-primary transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {application.status === 'pending' ? (
                            <>
                              <button 
                                onClick={() => handleApproveKyc(application.id)}
                                className="text-gray-400 hover:text-success transition-colors"
                                title="Approve KYC"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleRejectKyc(application.id)}
                                className="text-gray-400 hover:text-error transition-colors"
                                title="Reject KYC"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <button 
                              onClick={() => handleDeleteKyc(application.id)}
                              className="text-gray-400 hover:text-error transition-colors"
                              title="Delete KYC"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
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

      {/* KYC Detail Modal */}
      <KYCDetailModal
        kycId={selectedKycId}
        isOpen={showKycModal}
        onClose={() => {
          setShowKycModal(false);
          setSelectedKycId(null);
        }}
      />
    </div>
  );
};

export default KYCPage;