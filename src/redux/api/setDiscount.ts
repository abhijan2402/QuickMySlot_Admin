import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const setDiscountApi = createApi({
  reducerPath: "setDiscountApi",
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
  tagTypes: ["setDiscountApi"],
  endpoints: (builder) => ({
    // Get All setDiscount
    getsetDiscount: builder.query({
      query: () => `admin/cashback-setting-list`,
      providesTags: ["setDiscountApi"],
    }),

    // Add (POST) setDiscount
    addDiscount: builder.mutation({
      query: (body) => ({
        url: `admin/cashback-setting-store`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["setDiscountApi"],
    }),
    // Update (POST) setDiscount
    updateDiscount: builder.mutation({
      query: ({ body, id }) => ({
        url: `admin/cashback-setting-update/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["setDiscountApi"],
    }),

    // Delete Ad
    deleteAd: builder.mutation({
      query: ({body, id}) => ({
        url: `admin/cashback-setting-update/${id}`,
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["setDiscountApi"],
    }),
  }),
});

export const { useGetsetDiscountQuery, useAddDiscountMutation, useDeleteAdMutation, useUpdateDiscountMutation } =
  setDiscountApi;
