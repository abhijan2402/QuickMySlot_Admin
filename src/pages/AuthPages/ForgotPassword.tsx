import ForgotPasswordFlow from "../../components/auth/ForgotPasswordFlow";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";

const ForgotPassword = () => {
  return (
    <>
      <PageMeta
        title="QUICKmySLOT Admin"
        description="Manage your services efficiently — track services, clients, and operations all in one place."
      />
      <AuthLayout>
        <ForgotPasswordFlow />
      </AuthLayout>
    </>
  );
};

export default ForgotPassword;
