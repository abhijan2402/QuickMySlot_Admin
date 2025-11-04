import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
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
  tagTypes: ["notificationApi"],
  endpoints: (builder) => ({
    // Get All notification
    getnotification: builder.query({
      query: () => `admin/notification-shortcuts`,
      providesTags: ["notificationApi"],
    }),

    // Add (POST) notification
    sendNotification: builder.mutation({
      query: (formData) => ({
        url: `admin/notification-shortcuts`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["notificationApi"],
    }),

    // Delete Ad
    deleteAd: builder.mutation({
      query: (id) => ({
        url: `admin/notification-shortcuts/delete/${id}`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["notificationApi"],
    }),
  }),
});

export const {
  useGetnotificationQuery,
  useSendNotificationMutation,
  useDeleteAdMutation,
} = notificationApi;
