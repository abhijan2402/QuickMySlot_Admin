import { configureStore } from "@reduxjs/toolkit";
import { vendorApi } from "../api/vendorApi";
import { customerApi } from "../api/customerApi";
import { deliveryApi } from "../api/deliveryApi";
import { ticketListApi } from "../api/ticketListApi";
import { productApi } from "../api/productApi";
import { orderApi } from "../api/orderApi";
import { cmsApi } from "../api/cmsApi";
import { propertyApi } from "../api/propertyApi";
import { AdsApi } from "../api/AdsApi";
import { UserApi } from "../api/UserApi";
import { chargeApi } from "../api/chargeApi";
import { providerApi } from "../api/providerApi";
import { bidApi } from "../api/bidApi";
import { authApi } from "../api/authApi";
import { categoryApi } from "../api/categoryApi";
import { faqApi } from "../api/faqApi";
import { subscriptionApi } from "../api/subscriptionApi";
import { transactionApi } from "../api/transactionApi";
import { ordersApi } from "../api/ordersApi";
import { notificationApi } from "../api/notificationApi";
import { setDiscountApi } from "../api/setDiscount";
import { dashboardApi } from "../api/dashboard";

export const store = configureStore({
  reducer: {
    [vendorApi.reducerPath]: vendorApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
    [deliveryApi.reducerPath]: deliveryApi.reducer,
    [ticketListApi.reducerPath]: ticketListApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [cmsApi.reducerPath]: cmsApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [propertyApi.reducerPath]: propertyApi.reducer,
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
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(vendorApi.middleware)
      .concat(customerApi.middleware)
      .concat(deliveryApi.middleware)
      .concat(ticketListApi.middleware)
      .concat(productApi.middleware)
      .concat(orderApi.middleware)
      .concat(propertyApi.middleware)
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
      .concat(dashboardApi.middleware),
});
