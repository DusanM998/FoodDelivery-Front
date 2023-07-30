import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const shoppingCartApi = createApi({
    reducerPath: "shoppingCartApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://localhost:7046/api/"
    }),
    tagTypes: ["ShoppingCarts"],
    endpoints: (builder) => ({
        getShoppingCartById: builder.query({
            query: (userId) => ({
                url: `shoppingCart`,
                params: {
                    userId: userId
                }
            }),
            providesTags: ["ShoppingCarts"],
        }),
        updateShoppingCart: builder.mutation({
            query: ({ menuItemId, updateQuantityBy, userId }) => ({
                url: "shoppingCart",
                method: "POST",
                params: {
                    menuItemId,
                    updateQuantityBy,
                    userId,
                },
            }),
            invalidatesTags: ["ShoppingCarts"],
        }),
    }),
});

export const { useGetShoppingCartByIdQuery, useUpdateShoppingCartMutation } = shoppingCartApi;
export default shoppingCartApi;