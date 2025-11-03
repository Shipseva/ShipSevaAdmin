import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQueryWithToasts } from './baseQuery';
import { getApiUrl } from '@/config/apiConfig';

export interface KYCDocument {
  id: string;
  type: 'pan' | 'aadhar_front' | 'aadhar_back' | 'gst' | 'bank';
  fileName: string;
  fileKey: string;
  uploadedAt: string;
  status: 'pending' | 'verified' | 'rejected';
  number?: string;
}

export interface KYCApplication {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  businessType: 'individual' | 'agency';
  documents: KYCDocument[];
  bankInfo?: {
    bankName: string;
    branchName?: string;
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
  };
  gstInfo?: {
    gstNumber: string;
    gstCertificateKey?: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

import { getApiUrl } from '@/config/apiConfig';

export const kycApi = createApi({
  reducerPath: 'kycApi',
  baseQuery: createBaseQueryWithToasts(getApiUrl("KYC")),
  tagTypes: ['KYC'],
  endpoints: (builder) => ({
    // Get all KYC applications
    getAllKyc: builder.query<{
      applications: KYCApplication[];
      totalRecords: number;
      currentPage: number;
      totalPages: number;
    }, {
      status?: 'pending' | 'approved' | 'rejected';
      businessType?: 'individual' | 'agency';
      limit?: number;
      page?: number;
    }>({
      query: (params) => ({
        url: '/kyc',
        params,
      }),
      providesTags: ['KYC'],
    }),
    
    // Get single KYC application
    getKYCApplication: builder.query<KYCApplication, string>({
      query: (id) => `/kyc/${id}`,
      providesTags: ['KYC'],
    }),
    
    // Get KYC by ID (alias for getKYCApplication)
    getKycById: builder.query<KYCApplication, string>({
      query: (id) => `/kyc/${id}`,
      providesTags: ['KYC'],
    }),
    
    // Delete KYC application
    deleteKyc: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/kyc/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['KYC'],
    }),
    
    // Approve KYC application
    approveKyc: builder.mutation<{ success: boolean; message: string }, {
      id: string;
      reason?: string;
    }>({
      query: ({ id, reason }) => ({
        url: `/kyc/${id}/approve`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: ['KYC'],
    }),
    
    // Reject KYC application
    rejectKyc: builder.mutation<{ success: boolean; message: string }, {
      id: string;
      reason?: string;
    }>({
      query: ({ id, reason }) => ({
        url: `/kyc/${id}/reject`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: ['KYC'],
    }),
    
    // Update KYC application status (generic)
    updateKYCStatus: builder.mutation<{ success: boolean; message: string }, {
      id: string;
      status: 'verified' | 'rejected';
      reason?: string;
    }>({
      query: ({ id, status, reason }) => ({
        url: `/kyc/${id}/status`,
        method: 'PATCH',
        body: { status, reason },
      }),
      invalidatesTags: ['KYC'],
    }),
    
    // Update KYC application (generic update)
    updateKyc: builder.mutation<{ success: boolean; message: string }, {
      id: string;
      updates: Partial<{
        aadhar?: {
          aadharNumber?: string;
          aadharFront?: string;
          aadharBack?: string;
          documentStatus?: 'pending' | 'verified' | 'rejected';
        };
        pan?: {
          panNumber?: string;
          panFront?: string;
          panBack?: string;
          documentStatus?: 'pending' | 'verified' | 'rejected';
        };
        ifsc?: string;
        accountNumber?: string;
        accountHolderName?: string;
        bankName?: string;
        branchName?: string;
        gstNumber?: string;
        gstCertificate?: string;
        businessType?: 'individual' | 'agency';
        status?: 'pending' | 'verified' | 'rejected';
      }>;
    }>({
      query: ({ id, updates }) => ({
        url: `/kyc/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: ['KYC'],
    }),
    
    // Update document status
    updateDocumentStatus: builder.mutation<{ success: boolean; message: string }, {
      id: string;
      type: 'aadhar' | 'pan';
      documentStatus: 'pending' | 'verified' | 'rejected';
      reason?: string;
    }>({
      query: ({ id, type, documentStatus, reason }) => ({
        url: `/kyc/${id}`,
        method: 'PATCH',
        body: {
          [type]: { documentStatus },
          ...(reason && { reason })
        },
      }),
      invalidatesTags: ['KYC'],
    }),
    
    // Get KYC statistics
    getKycStats: builder.query<{
      total: number;
      pending: number;
      approved: number;
      rejected: number;
      individual: number;
      agency: number;
    }, void>({
      query: () => '/kyc/stats',
      providesTags: ['KYC'],
    }),
  }),
});

export const {
  useGetAllKycQuery,
  useGetKYCApplicationQuery,
  useGetKycByIdQuery,
  useDeleteKycMutation,
  useApproveKycMutation,
  useRejectKycMutation,
  useUpdateKYCStatusMutation,
  useUpdateKycMutation,
  useUpdateDocumentStatusMutation,
  useGetKycStatsQuery,
} = kycApi;