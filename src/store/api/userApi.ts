import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQueryWithToasts } from './baseQuery';
import { setAdmin, logout } from '@/store/slices/adminSlice';

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

        // Do not force a default status; when not provided, return all statuses

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
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('✅ getCurrentUser successful:', data);
          
          // Transform user data to admin format
          const adminData = {
            id: data.id,
            email: data.email,
            name: data.name,
            role: data.role === 'admin' ? 'admin' : 'moderator', // Map user role to admin role
            permissions: data.permissions || [], // Provide empty array if no permissions
            createdAt: data.createdAt,
            lastLoginAt: data.lastLoginAt,
          };
          
          dispatch(setAdmin({ admin: adminData, token: 'cookie' }));
        } catch (error) {
          console.error('❌ getCurrentUser failed:', error);
          dispatch(logout()); // This will handle the redirect
        }
      },
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
