import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQueryWithToasts } from './baseQuery';

export const fileApi = createApi({
  reducerPath: 'fileApi',
  baseQuery: createBaseQueryWithToasts(''),
  tagTypes: ['File'],
  endpoints: (builder) => ({
    getSignedUrl: builder.query<{ success: boolean; url: string; expiresIn: number }, string>({
      query: (key) => `/api/files/signed-url?key=${encodeURIComponent(key)}`,
      providesTags: ['File'],
    }),
  }),
});

export const {
  useGetSignedUrlQuery,
} = fileApi;
