import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from './baseQuery';
import { setAdmin, logout } from '@/store/slices/adminSlice';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: createBaseQuery( 'http://localhost/users', true), // excludeAuthApis = true, no toasts
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (credentials: { identifier: string; password: string; queryType: string }) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    adminLogout: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
    getAdminProfile: builder.query({
      query: () => '/get-current-user',
      providesTags: ['Auth'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('✅ getAdminProfile successful:', data);
          dispatch(setAdmin({ admin: data, token: 'cookie' }));
        } catch (error) {
          console.error('❌ getAdminProfile failed:', error);
          dispatch(logout()); // This will handle the redirect
        }
      },
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: '/refresh',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useAdminLogoutMutation,
  useGetAdminProfileQuery,
  useRefreshTokenMutation,
} = authApi;
