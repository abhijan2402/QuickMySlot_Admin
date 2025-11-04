import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="QucikMySLOT Admin"
        description="Manage your services efficiently — track services, clients, and operations all in one place."
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
