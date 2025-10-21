import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQueryWithToasts } from './baseQuery';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: createBaseQueryWithToasts(process.env.NEXT_PUBLIC_API_URL || 'http://localhost'),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    // Get all users with advanced filtering
    getAllUsers: builder.query({
      query: (params?: {
        name?: string;
        email?: string;
        phone?: string;
        status?: 'pending' | 'verified' | 'rejected';
        isEmailVerified?: boolean;
        role?: 'individual' | 'agency' | 'admin';
        limit?: number;
        page?: number;
        sortBy?: 'createdAt';
        sortOrder?: 'ASC' | 'DESC';
      }) => {
        // Filter out empty/null/undefined values and add default status
        const filteredParams = Object.entries(params || {}).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            acc[key] = value;
          }
          return acc;
        }, {} as Record<string, any>);

        // Add default status if no status is provided
        if (!filteredParams.status) {
          filteredParams.status = 'verified';
        }

        return {
          url: '/users',
          params: filteredParams,
        };
      },
      transformResponse: (response: {
        data: any[];
        totalRecords: number;
        currentPage: number;
      }) => ({
        users: response.data,
        totalRecords: response.totalRecords,
        currentPage: response.currentPage,
        totalPages: Math.ceil(response.totalRecords / (response.data.length || 1))
      }),
      providesTags: ['User'],
    }),
    
    // Get current user profile
    getCurrentUser: builder.query({
      query: () => '/users/get-current-user',
      providesTags: ['User'],
    }),
    
    // Get user by ID
    getUserById: builder.query({
      query: (userId: string) => `/users/${userId}`,
      providesTags: ['User'],
    }),
    
    // Update user profile
    updateUser: builder.mutation({
      query: ({ userId, ...updates }: { 
        userId: string; 
        name?: string;
        phone?: string;
        status?: 'pending' | 'verified' | 'rejected';
        isEmailVerified?: boolean;
      }) => ({
        url: `/users/${userId}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: ['User'],
    }),
    
    // Delete user
    deleteUser: builder.mutation({
      query: (userId: string) => ({
        url: `/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    
    // Ban user (admin specific)
    banUser: builder.mutation({
      query: ({ id, reason }: { id: string; reason?: string }) => ({
        url: `/admin/users/${id}/ban`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: ['User'],
    }),
    
    // Unban user (admin specific)
    unbanUser: builder.mutation({
      query: (id: string) => ({
        url: `/admin/users/${id}/unban`,
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    
    // Get user statistics
    getUserStats: builder.query({
      query: () => '/admin/users/stats',
      providesTags: ['User'],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetCurrentUserQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useBanUserMutation,
  useUnbanUserMutation,
  useGetUserStatsQuery,
} = userApi;
