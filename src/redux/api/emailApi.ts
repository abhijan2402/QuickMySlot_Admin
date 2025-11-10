import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const emailApi = createApi({
  reducerPath: "emailApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["emailApi"],
  endpoints: (builder) => ({
    // Get All email
    getemail: builder.query({
      query: () => `admin/email-shortcuts`,
      providesTags: ["emailApi"],
    }),

    // Add (POST) email
    addemail: builder.mutation({
      query: ({ formData, id }) => ({
        url: `admin/email-shortcuts`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["emailApi"],
    }),
    // Send (POST) email
    sendemail: builder.mutation({
      query: ({ formData, id }) => ({
        url: `admin/email-shortcuts/send/${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["emailApi"],
    }),
    // Add (POST) email
    updateemail: builder.mutation({
      query: ({ formData, id }) => ({
        url: `admin/email-shortcuts/update/${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["emailApi"],
    }),

    deleteemail: builder.mutation({
      query: (id) => ({
        url: `admin/email-shortcuts/delete/${id}`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["emailApi"],
    }),
  }),
});

export const {
  useGetemailQuery,
  useAddemailMutation,
  useDeleteemailMutation,
  useUpdateemailMutation,
  useSendemailMutation
} = emailApi;
