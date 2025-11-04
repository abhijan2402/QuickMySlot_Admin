import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const subscriptionApi = createApi({
  reducerPath: "subscriptionApi",
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
  tagTypes: ["subscriptionApi"],
  endpoints: (builder) => ({
    // Get All subscription
    getsubscription: builder.query({
      query: ({ type, validity }) =>
        `subscriptions?type=${type}&validity=${validity}`,
      providesTags: ["subscriptionApi"],
    }),

    // Add (POST) subscription
    addsubscription: builder.mutation({
      query: (formData) => ({
        url: `admin/subscriptions`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["subscriptionApi"],
    }),
    // Add (POST) subscription
    updatesubscription: builder.mutation({
      query: ({ formData, id }) => ({
        url: `admin/subscriptions/update/${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["subscriptionApi"],
    }),

    deletesubscription: builder.mutation({
      query: (id) => ({
        url: `admin/subscriptions/delete/${id}`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["subscriptionApi"],
    }),
  }),
});

export const {
  useGetsubscriptionQuery,
  useAddsubscriptionMutation,
  useDeletesubscriptionMutation,
  useUpdatesubscriptionMutation,
} = subscriptionApi;
