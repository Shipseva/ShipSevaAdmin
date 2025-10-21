import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQueryWithToasts } from './baseQuery';

export const kycApi = createApi({
  reducerPath: 'kycApi',
  baseQuery: createBaseQueryWithToasts(process.env.NEXT_PUBLIC_API_URL || 'http://localhost'),
  tagTypes: ['KYC'],
  endpoints: (builder) => ({
    // Get all KYC records with advanced filtering
    getAllKyc: builder.query({
      query: (params?: {
        name?: string;
        status?: 'pending' | 'verified' | 'rejected';
        businessType?: 'individual' | 'company' | 'partnership' | 'llp' | 'trust' | 'other';
        aadharVerified?: boolean;
        panVerified?: boolean;
        limit?: number;
        page?: number;
        sortBy?: 'createdAt' | 'status' | 'businessType';
        sortOrder?: 'ASC' | 'DESC';
      }) => {
        // Filter out empty/null/undefined values
        const filteredParams = Object.entries(params || {}).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            acc[key] = value;
          }
          return acc;
        }, {} as Record<string, any>);

        return {
          url: '/kyc',
          params: filteredParams,
        };
      },
      transformResponse: (response: {
        data: any[];
        totalRecords: number;
        currentPage: number;
      }) => ({
        kycRecords: response.data,
        totalRecords: response.totalRecords,
        currentPage: response.currentPage,
        totalPages: Math.ceil(response.totalRecords / (response.data.length || 1))
      }),
      providesTags: ['KYC'],
    }),
    
    // Get KYC records for current user
    getCurrentUserKyc: builder.query({
      query: () => '/kyc/userDocuments',
      providesTags: ['KYC'],
    }),
    
    // Get KYC record by ID
    getKycById: builder.query({
      query: (id: string) => `/kyc/${id}`,
      providesTags: ['KYC'],
    }),
    
    // Update KYC record
    updateKyc: builder.mutation({
      query: ({ id, ...updates }: {
        id: string;
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
        businessType?: 'individual' | 'company' | 'partnership' | 'llp' | 'trust' | 'other';
        status?: 'pending' | 'verified' | 'rejected';
      }) => ({
        url: `/kyc/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: ['KYC'],
    }),
    
    // Delete KYC record
    deleteKyc: builder.mutation({
      query: (id: string) => ({
        url: `/kyc/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['KYC'],
    }),
    
    // Update document status
    updateDocumentStatus: builder.mutation({
      query: ({ id, type, documentStatus }: {
        id: string;
        type: 'aadhar' | 'pan';
        documentStatus: 'pending' | 'verified' | 'rejected';
      }) => ({
        url: `/kyc/updateDocumentStatus/${id}`,
        method: 'PATCH',
        body: { type, documentStatus },
      }),
      invalidatesTags: ['KYC'],
    }),
    
    // Approve KYC (admin specific)
    approveKyc: builder.mutation({
      query: (id: string) => ({
        url: `/admin/kyc/${id}/approve`,
        method: 'POST',
      }),
      invalidatesTags: ['KYC'],
    }),
    
    // Reject KYC (admin specific)
    rejectKyc: builder.mutation({
      query: ({ id, reason }: { id: string; reason?: string }) => ({
        url: `/admin/kyc/${id}/reject`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: ['KYC'],
    }),
    
    // Get KYC statistics
    getKycStats: builder.query({
      query: () => '/admin/kyc/stats',
      providesTags: ['KYC'],
    }),
  }),
});

export const {
  useGetAllKycQuery,
  useGetCurrentUserKycQuery,
  useGetKycByIdQuery,
  useUpdateKycMutation,
  useDeleteKycMutation,
  useUpdateDocumentStatusMutation,
  useApproveKycMutation,
  useRejectKycMutation,
  useGetKycStatsQuery,
} = kycApi;
