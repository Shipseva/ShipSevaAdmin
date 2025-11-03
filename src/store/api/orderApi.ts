import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQueryWithToasts } from './baseQuery';
import { getApiUrl } from '@/config/apiConfig';

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: createBaseQueryWithToasts(getApiUrl("ORDERS")),
  tagTypes: ['Order'],
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: (params?: { 
        page?: number; 
        limit?: number; 
        search?: string; 
        status?: string; 
        dateFrom?: string; 
        dateTo?: string;
        userId?: string;
      }) => ({
        url: '/admin/orders',
        params,
      }),
      providesTags: ['Order'],
    }),
    getOrderById: builder.query({
      query: (id: string) => `/admin/orders/${id}`,
      providesTags: ['Order'],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, status, notes }: { id: string; status: string; notes?: string }) => ({
        url: `/admin/orders/${id}/status`,
        method: 'PATCH',
        body: { status, notes },
      }),
      invalidatesTags: ['Order'],
    }),
    cancelOrder: builder.mutation({
      query: ({ id, reason }: { id: string; reason: string }) => ({
        url: `/admin/orders/${id}/cancel`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: ['Order'],
    }),
    getOrderStats: builder.query({
      query: (params?: { dateFrom?: string; dateTo?: string }) => ({
        url: '/admin/orders/stats',
        params,
      }),
      providesTags: ['Order'],
    }),
    getOrderAnalytics: builder.query({
      query: (params?: { period?: string; dateFrom?: string; dateTo?: string }) => ({
        url: '/admin/orders/analytics',
        params,
      }),
      providesTags: ['Order'],
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  useGetOrderStatsQuery,
  useGetOrderAnalyticsQuery,
} = orderApi;
