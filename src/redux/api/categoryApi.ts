import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
  }),
  tagTypes: ["categoryApi"],
  endpoints: (builder) => ({
    // Get All category
    getcategory: builder.query({
      query: () => `category`,
      providesTags: ["categoryApi"],
    }),

    // Add (POST) category
    addCategory: builder.mutation({
      query: ({ formData, id }) => ({
        url: `admin/category/update/${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["categoryApi"],
    }),
  }),
});

export const { useGetcategoryQuery, useAddCategoryMutation } = categoryApi;
