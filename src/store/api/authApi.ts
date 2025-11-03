import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from './baseQuery';
import { getApiUrl } from '@/config/apiConfig';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: createBaseQuery(getApiUrl("AUTH"), true), // excludeAuthApis = true, no toasts
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
  useRefreshTokenMutation,
} = authApi;
