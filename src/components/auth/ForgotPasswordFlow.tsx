import { useState } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { Link } from "react-router-dom";

export default function ForgotPasswordFlow() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: "",
    otp: "",
    password: "",
    confirm: "",
  });

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    console.log("Forgot Password - Email submitted:", form.email);
    setStep(2);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    console.log("OTP entered:", form.otp);
    setStep(3);
  };

  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Password reset to:", form.password);
    alert("Password reset successfully!");
    // Navigate to sign-in page if needed
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto py-10">
        {/* Step Heading */}
        <div className="mb-6 text-center">
          {step === 1 && (
            <>
              <h1 className="mb-2 font-semibold text-gray-800 text-xl">
                Forgot Password
              </h1>
              <p className="text-sm text-gray-500">
                Enter your registered email, and we’ll send you an OTP to reset
                your password.
              </p>
            </>
          )}
          {step === 2 && (
            <>
              <h1 className="mb-2 font-semibold text-gray-800 text-xl">
                Verify OTP
              </h1>
              <p className="text-sm text-gray-500">
                Enter the OTP sent to your email to proceed.
              </p>
            </>
          )}
          {step === 3 && (
            <>
              <h1 className="mb-2 font-semibold text-gray-800 text-xl">
                Reset Password
              </h1>
              <p className="text-sm text-gray-500">
                Enter your new password and confirm to complete the process.
              </p>
            </>
          )}
        </div>

        {/* Step Forms */}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div>
              <Label>
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                type="email"
                placeholder="info@gmail.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-[#4C4A89] text-white font-semibold rounded-lg shadow-md hover:bg-[#EE4E34] transition"
            >
              Send OTP
            </button>
            <p className="text-sm text-center mt-3">
              Back to{" "}
              <Link to="/signin" className="text-[#EE4E34] hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div>
              <Label>
                OTP Code <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                placeholder="Enter OTP"
                value={form.otp}
                onChange={(e) => setForm({ ...form, otp: e.target.value })}
              />
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm text-gray-500 hover:underline"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => console.log("Resend OTP")}
                className="text-sm text-[#EE4E34] hover:underline"
              >
                Resend OTP
              </button>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-[#4C4A89] text-white font-semibold rounded-lg shadow-md hover:bg-[#EE4E34]  transition"
            >
              Verify OTP
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPasswordSubmit} className="space-y-6">
            <div>
              <Label>
                New Password <span className="text-red-500">*</span>
              </Label>
              <Input
                type="password"
                placeholder="Enter new password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <div>
              <Label>
                Confirm Password <span className="text-red-500">*</span>
              </Label>
              <Input
                type="password"
                placeholder="Confirm password"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              />
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-sm text-gray-500 hover:underline"
              >
                ← Back
              </button>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
