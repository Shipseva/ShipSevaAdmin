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
        url: '',
        params,
      }),
      providesTags: ['KYC'],
    }),
    
    // Get single KYC application
    getKYCApplication: builder.query<KYCApplication, string>({
      query: (id) => `/${id}`,
      providesTags: ['KYC'],
    }),
    
    // Get KYC by ID (alias for getKYCApplication)
    getKycById: builder.query<KYCApplication, string>({
      query: (id) => `/${id}`,
      providesTags: ['KYC'],
    }),
    
    // Delete KYC application
    deleteKyc: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
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
        url: `/${id}/status`,
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
        url: `/${id}`,
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
        url: `/${id}`,
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
      query: () => '/stats',
      providesTags: ['KYC'],
    }),
  }),
});

export const {
  useGetAllKycQuery,
  useGetKYCApplicationQuery,
  useGetKycByIdQuery,
  useDeleteKycMutation,
  useUpdateKYCStatusMutation,
  useUpdateKycMutation,
  useUpdateDocumentStatusMutation,
  useGetKycStatsQuery,
} = kycApi;