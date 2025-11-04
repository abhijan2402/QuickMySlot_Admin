import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const transactionApi = createApi({
  reducerPath: "transactionApi",
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
  tagTypes: ["transactionApi"],
  endpoints: (builder) => ({
    // Get All transaction
    gettransaction: builder.query({
      query: ({ role }) => `admin/all-transactions?role=${role}`,
      providesTags: ["transactionApi"],
    }),
  }),
});

export const { useGettransactionQuery } = transactionApi;
