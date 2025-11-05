import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const providerApi = createApi({
  reducerPath: "providerApi",
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
  tagTypes: ["provider"],

  endpoints: (builder) => ({
    // Add provider
    addprovider: builder.mutation({
      query: (providerData) => ({
        url: "admin/provider-register",
        method: "POST",
        body: providerData,
      }),
      invalidatesTags: ["provider"],
    }),

    // Get All providers
    getproviders: builder.query<any, void>({
      query: () => "admin/vendor/list",
      providesTags: ["provider"],
    }),

    // Delete provider
    deleteprovider: builder.mutation({
      query: (id) => ({
        url: `delete/${id}`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["provider"],
    }),

    // Update/Edit provider
    editprovider: builder.mutation({
      query: ({ id, formData }) => ({
        url: `admin/provider-update/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["provider"],
    }),

    // Update provider Status (block/unblock)
    updateproviderStatus: builder.mutation({
      query: ({ id, formdata }) => ({
        url: `change/status/${id}`,
        method: "POST",
        body: formdata,
      }),
      invalidatesTags: ["provider"],
    }),
    // Update IsHighlighted Status
    updateproviderIsHighlighted: builder.mutation({
      query: (formdata) => ({
        url: `admin/vendor_highlighted`,
        method: "POST",
        body: formdata,
      }),
      invalidatesTags: ["provider"],
    }),
    // Add Cashback
    addproviderCashback: builder.mutation({
      query: (providerData) => ({
        url: "admin/vendor_cashback",
        method: "POST",
        body: providerData,
      }),
      invalidatesTags: ["provider"],
    }),
  }),
});

export const {
  useAddproviderMutation,
  useGetprovidersQuery,
  useDeleteproviderMutation,
  useEditproviderMutation,
  useUpdateproviderStatusMutation,
  useUpdateproviderIsHighlightedMutation,
  useAddproviderCashbackMutation
} = providerApi;
