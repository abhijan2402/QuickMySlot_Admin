import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
  }),
  tagTypes: ["authApi"],
  endpoints: (builder) => ({
    // Add (POST) auth
    loginAdmin: builder.mutation({
      query: (formData) => ({
        url: `login`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["authApi"],
    }),
  }),
});

export const { useLoginAdminMutation } = authApi;
