import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const UserApi = createApi({
  reducerPath: "UserApi",
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

    // Get All Users
    getUsers: builder.query<any, void>({
      query: () => "admin/user/list",
      providesTags: ["User"],
    }),
    getUsersDetails: builder.query<any, void>({
      query: (id) => `customer/shops/${id}`,
      providesTags: ["User"],
    }),

    // Delete User
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `delete/${id}`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["User"],
    }),

    // Update/Edit User
    editUser: builder.mutation({
      query: ({ id, formData }) => ({
        url: `admin/user-update/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),

    // Update User Status (block/unblock)
    updateUserStatus: builder.mutation({
      query: ({ id, formdata }) => ({
        url: `change/status/${id}`,
        method: "POST",
        body: formdata,
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
} = UserApi;
