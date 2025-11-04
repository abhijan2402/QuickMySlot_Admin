import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const faqApi = createApi({
  reducerPath: "faqApi",
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
  tagTypes: ["faqApi"],
  endpoints: (builder) => ({
    // Get All faq
    getfaq: builder.query({
      query: ({ role }) => `admin/faq-support?role=${role}`,
      providesTags: ["faqApi"],
    }),

    // Add (POST) faq
    addfaq: builder.mutation({
      query: (formData) => ({
        url: `admin/faq-support`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["faqApi"],
    }),
    // Add (POST) faq
    updatefaq: builder.mutation({
      query: ({ formData, id }) => ({
        url: `admin/faq-support/update/${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["faqApi"],
    }),

    deletefaq: builder.mutation({
      query: (id) => ({
        url: `admin/faq-support/delete/${id}`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["faqApi"],
    }),
    faqApproved: builder.mutation({
      query: (id) => ({
        url: `faq-entri-aaproved/${id}`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["faqApi"],
    }),
  }),
});

export const {
  useGetfaqQuery,
  useAddfaqMutation,
  useFaqApprovedMutation,
  useDeletefaqMutation,
  useUpdatefaqMutation,
} = faqApi;
