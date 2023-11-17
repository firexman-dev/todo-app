import { BASE_URL } from '@/utils/url.config';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const TaskApi = createApi({
  reducerPath: 'taskApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['Tasks'],
  endpoints: (builder) => ({
    getTask: builder.mutation({
        query: (token) => ({
          headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
            },
          url: '/tasks',
          method: 'GET',
        }),
        invalidatesTags: ['Tasks'],
        transformResponse: (response:any) => response,
      }),

    createTask: builder.mutation({
      query: ({values, token}) => ({
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        },
        url: '/tasks',
        method: 'POST',
        body: values,
      }),
      invalidatesTags: ['Tasks'],
      transformResponse: (response:any) => response,
    }),

    updateTask: builder.mutation({
      query: ({ values, token, update_id }) => ({
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        },
        url: `/tasks/${update_id}`,
        method: 'PUT',
        body: values,
      }),
      invalidatesTags: ['Tasks'],
      transformResponse: (response:any) => response,
    }),

    deleteTask: builder.mutation({
      query: ({id, token}) => ({
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        },
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tasks'],
    }),
  }),
});

export const {
  useGetTaskMutation,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = TaskApi;