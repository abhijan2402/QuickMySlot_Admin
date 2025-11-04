import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";

import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Ads from "./pages/Ads/Ads";
import Tickets from "./pages/Tickets/Tickets";
import ForgotPassword from "./pages/AuthPages/ForgotPassword";
import CutomersAnalytics from "./pages/Customers/CutomersAnalytics";
import CustomerManagement from "./pages/Customers/CustomerManagement";
import ProvidersManagement from "./pages/Providers/ProvidersManagement";
import ProvidersAnalytics from "./pages/Providers/ProvidersAnalytics";
import Orders from "./pages/Orders/Orders";
import PrivacyPolicyPage from "./pages/CMS/CMS";
import ProviderDetails from "./pages/Providers/ProviderDetails";
import CustomerDetails from "./pages/Customers/CustomerDetails ";
import Transaction from "./pages/Transaction/Transaction";
import NotifyMessages from "./pages/Notification/NotifyMessages";
import WhatsAppMedia from "./pages/Whatsapp/WhatsAppMedia";
import Mail from "./pages/Email/Mail";
import Bid from "./pages/Bid/Bid";
import ProtectedRoute from "./context/ProtectedRoute";
import CategoryManagement from "./pages/Category/CategoryManagement";
import FaqManagement from "./pages/Faq/FaqManagement";
import SubscriptionManagement from "./pages/Subscription/SunscriptionManagement";
import BidDetails from "./pages/Bid/BidDetails";
import SetDiscount from "./pages/SetDiscount/SetDiscount";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/reset-password" element={<ForgotPassword />} />

          {/* Dashboard Layout */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            {/* <Route element={<AppLayout />}> */}
            <Route index path="/" element={<Home />} />
            <Route path="/category" element={<CategoryManagement />} />
            <Route path="/bid" element={<Bid />} />
            <Route
              path="/bid-details/:categoryId/:type"
              element={<BidDetails />}
            />

            <Route path="/customer-analytics" element={<CutomersAnalytics />} />
            <Route
              path="/customer-management"
              element={<CustomerManagement />}
            />
            <Route path="/customer-details/:id" element={<CustomerDetails />} />
            <Route
              path="/providers-management"
              element={<ProvidersManagement />}
            />
            <Route
              path="/providers-analytics"
              element={<ProvidersAnalytics />}
            />
            <Route
              path="/providers-details/:id"
              element={<ProviderDetails />}
            />
            <Route path="/orders" element={<Orders />} />
            <Route path="/transaction" element={<Transaction />} />
            <Route path="/notification" element={<NotifyMessages />} />
            <Route path="/media" element={<WhatsAppMedia />} />
            <Route path="/mail" element={<Mail />} />
            <Route path="/ads" element={<Ads />} />
            <Route path="/cms" element={<PrivacyPolicyPage />} />
            <Route path="/faq" element={<FaqManagement />} />
            <Route path="/subscription" element={<SubscriptionManagement />} />
            <Route path="/set-discount" element={<SetDiscount />} />

            <Route path="/tickets" element={<Tickets />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset-password" element={<ForgotPassword />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
