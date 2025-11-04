import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const chargeApi = createApi({
  reducerPath: "chargeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
  }),
  tagTypes: ["charges"],
  endpoints: (builder) => ({
    getCharges: builder.query({
      query: () => "commission-list",
      providesTags: ["charges"],
    }),
    addCharges: builder.mutation({
      query: (formdata) => ({
        url: `commission-add`,
        method: "POST",
        body: formdata,
      }),
      invalidatesTags: ["charges"],
    }),
  }),
});

export const { useGetChargesQuery, useAddChargesMutation } = chargeApi;
