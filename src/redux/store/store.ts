import { configureStore } from "@reduxjs/toolkit";
import { cmsApi } from "../api/cmsApi";
import { AdsApi } from "../api/AdsApi";
import { UserApi } from "../api/UserApi";
import { providerApi } from "../api/providerApi";
import { ordersApi } from "../api/ordersApi";
import { bidApi } from "../api/bidApi";
import { authApi } from "../api/authApi";
import { categoryApi } from "../api/categoryApi";
import { faqApi } from "../api/faqApi";
import { subscriptionApi } from "../api/subscriptionApi";
import { transactionApi } from "../api/transactionApi";
import { notificationApi } from "../api/notificationApi";
import { setDiscountApi } from "../api/setDiscount";
import { dashboardApi } from "../api/dashboard";
import { emailApi } from "../api/emailApi";

export const store = configureStore({
  reducer: {
 
    [cmsApi.reducerPath]: cmsApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [AdsApi.reducerPath]: AdsApi.reducer,
    [UserApi.reducerPath]: UserApi.reducer,
    [providerApi.reducerPath]: providerApi.reducer,
    [bidApi.reducerPath]: bidApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [faqApi.reducerPath]: faqApi.reducer,
    [subscriptionApi.reducerPath]: subscriptionApi.reducer,
    [transactionApi.reducerPath]: transactionApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [setDiscountApi.reducerPath]: setDiscountApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [emailApi.reducerPath]: emailApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
     
      .concat(cmsApi.middleware)
      .concat(AdsApi.middleware)
      .concat(UserApi.middleware)
      .concat(providerApi.middleware)
      .concat(bidApi.middleware)
      .concat(authApi.middleware)
      .concat(categoryApi.middleware)
      .concat(faqApi.middleware)
      .concat(transactionApi.middleware)
      .concat(subscriptionApi.middleware)
      .concat(ordersApi.middleware)
      .concat(notificationApi.middleware)
      .concat(setDiscountApi.middleware)
      .concat(dashboardApi.middleware)
      .concat(emailApi.middleware),
});
