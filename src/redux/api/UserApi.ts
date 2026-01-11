import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const UserApi = createApi({
  reducerPath: "UserApi",
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
  tagTypes: ["User"],

  endpoints: (builder) => ({
    // Add User
    addUser: builder.mutation({
      query: (userData) => ({
        url: "admin/user-register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    getUsers: builder.query({
      query: ({ search, page, per_page }) =>
        `admin/user/list?search=${search}&per_page=${per_page}&page=${page}`,
      providesTags: ["User"],
    }),

    getUsersDetails: builder.query<any, void>({
      query: (id) => `customer/shops/${id}`,
      providesTags: ["User"],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `admin/user/delete/${id}`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["User"],
    }),

    updateUserStatus: builder.mutation({
      query: (id) => ({
        url: `admin/user/status/${id}`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["User"],
    }),

    getUsersAnalysis: builder.query<any, void>({
      query: () => `analytics/customers`,
      providesTags: ["User"],
    }),

    editUser: builder.mutation({
      query: ({ id, formData }) => ({
        url: `admin/user-update/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useAddUserMutation,
  useGetUsersQuery,
  useGetUsersDetailsQuery,
  useDeleteUserMutation,
  useEditUserMutation,
  useUpdateUserStatusMutation,
  useGetUsersAnalysisQuery,
} = UserApi;
