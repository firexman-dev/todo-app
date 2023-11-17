import { BASE_URL } from '@/utils/url.config';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const ListApi = createApi({
  reducerPath: 'listApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['Lists'],
  endpoints: (builder) => ({
    getList: builder.mutation({
        query: (token) => ({
          headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
            },
          url: '/lists',
          method: 'GET',
        }),
        invalidatesTags: ['Lists'],
        transformResponse: (response:any) => response,
      }),

    createList: builder.mutation({
      query: ({values, token}) => ({
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        },
        url: '/lists',
        method: 'POST',
        body: values,
      }),
      invalidatesTags: ['Lists'],
      transformResponse: (response:any) => response,
    }),

    updateList: builder.mutation({
      query: ({ values, token, update_id }) => ({
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        },
        url: `/lists/${update_id}`,
        method: 'PUT',
        body: values,
      }),
      invalidatesTags: ['Lists'],
      transformResponse: (response:any) => response,
    }),

    deleteList: builder.mutation({
      query: ({id, token}) => ({
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        },
        url: `/lists/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Lists'],
    }),

    getListId: builder.mutation({
      query: ({id, token}) => ({
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
          },
        url: `/lists/${id}/tasks`,
        method: 'GET',
      }),
      invalidatesTags: ['Lists'],
      transformResponse: (response:any) => response,
    }),
  }),
});

export const {
  useGetListMutation,
  useCreateListMutation,
  useUpdateListMutation,
  useDeleteListMutation,
  useGetListIdMutation,
} = ListApi;