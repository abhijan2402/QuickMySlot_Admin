import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="QUICKmySLOT Admin"
        description="Manage your services efficiently — track services, clients, and operations all in one place."
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
