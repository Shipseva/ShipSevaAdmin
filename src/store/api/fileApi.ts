import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQueryWithToasts } from './baseQuery';

export const fileApi = createApi({
  reducerPath: 'fileApi',
  baseQuery: createBaseQueryWithToasts(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'),
  tagTypes: ['File'],
  endpoints: (builder) => ({
    getSignedUrl: builder.query<{ success: boolean; url: string; expiresIn: number }, string>({
      query: (key) => `/files/signed-url?key=${encodeURIComponent(key)}`,
      providesTags: ['File'],
    }),
  }),
});

export const {
  useGetSignedUrlQuery,
} = fileApi;
