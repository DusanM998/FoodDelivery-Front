import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const menuItemApi = createApi({
    reducerPath: "menuItemApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://localhost:7046/api/",
        prepareHeaders: (headers: Headers, api) => {
            const token = localStorage.getItem("token");
            token && headers.append("Authorization", "Bearer" + token);
        },
    }),
    tagTypes: ["MenuItems"],
    endpoints: (builder) => ({
        getMenuItems: builder.query({
            query: () => ({
                url:"menuitem"
            }),
            providesTags: ["MenuItems"]
        }),
        getMenuItemById: builder.query({
            query: (id) => ({
                url:`menuitem/${id}`,
            }),
            providesTags: ["MenuItems"],
        }),
        updateMenuItem: builder.mutation({
            query: ({data, id}) => ({
                url: "MenuItem/" + id,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["MenuItems"],
        }),
        createMenuItem: builder.mutation({
            query: (data) => ({
                url: "MenuItem",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["MenuItems"],
        }),
        deleteMenuItem: builder.mutation({
            query: (id) => ({
                url: "MenuItem/" + id,
                method: "DELETE",
            }),
            invalidatesTags: ["MenuItems"],
        }),
    }),
});

export const { 
    useGetMenuItemsQuery,
    useGetMenuItemByIdQuery,
    useUpdateMenuItemMutation,
    useCreateMenuItemMutation,
    useDeleteMenuItemMutation
} = menuItemApi;

export default menuItemApi;