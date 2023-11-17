import { BASE_URL } from '@/utils/url.config';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const LoginApi = createApi({
  reducerPath: 'loginApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['login'],
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (values) => ({
        url: '/users/login',
        method: 'POST',
        body: values,
      }),
      invalidatesTags: ['login'],
      transformResponse: (response:any) => response,
    }),
  }),
});

export const {
  useLoginUserMutation,
} = LoginApi;