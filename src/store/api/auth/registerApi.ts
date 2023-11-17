import { BASE_URL } from '@/utils/url.config';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const RegisterApi = createApi({
  reducerPath: 'registerApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['register'],
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (values) => ({
        url: '/users/register',
        method: 'POST',
        body: values,
      }),
      invalidatesTags: ['register'],
      transformResponse: (response:any) => response,
    }),
  }),
});

export const {
  useCreateUserMutation,
} = RegisterApi;
