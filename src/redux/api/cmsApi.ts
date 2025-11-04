import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseUrl = import.meta.env.VITE_BASE_URL;

export const cmsApi = createApi({
  reducerPath: "cmsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["cms"],
  endpoints: (builder) => ({
    // ✅ Fetch CMS page content by slug & user_type
    getCms: builder.query({
      query: ({ slug, type }) => ({
        url: `cms-page?type=${type}&slug=${slug}`,
        method: "GET",
      }),
      providesTags: ["cms"],
    }),

    // update cms
    editCms: builder.mutation({
      query: (formdata) => ({
        url: `cms-page-update`,
        method: "POST",
        body: formdata,
      }),
      invalidatesTags: ["cms"],
    }),
  }),
});

export const { useEditCmsMutation, useGetCmsQuery } = cmsApi;
