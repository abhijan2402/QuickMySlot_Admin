import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("qms_admin_token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["authApi"],
  endpoints: (builder) => ({
    loginAdmin: builder.mutation({
      query: (formData) => ({
        url: `login`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["authApi"],
    }),
    change_Admin_Password: builder.mutation({
      query: (formData) => ({
        url: `reset-pass/all`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["authApi"],
    }),
  }),
});

export const { useLoginAdminMutation, useChange_Admin_PasswordMutation } =
  authApi;
