import { useState } from "react";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

export default function SignInForm() {
  const { login } = useAuth();
  const [isLoginIn, setIsLoginIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoginIn(true);
    const formData = new FormData();
    formData.append("email_or_phone", e.target.email.value);
    formData.append("password", e.target.password.value);

    const res = await login(formData);
    setIsLoginIn(false);
    // console.log(res);
    navigate("/");
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8 flex justify-center flex-col items-center">
            <img
              width={60}
              height={20}
              src="/logo.png"
              alt="Logo"
              className="mb-2 lg:hidden"
            />
            <h1 className="mb-2 font-semibold text-[#EE4E34] text-title-sm sm:text-title-md">
              Login Here
            </h1>
            <p className="text-sm text-gray-800">
              Enter your email and password to sign in!
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Email Field */}
              <div>
                <Label>
                  Email <span className="text-error-500">*</span>
                </Label>
                <Input name="email" type="email" placeholder="info@gmail.com" />
              </div>

              {/* Password Field */}
              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-800 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-800 size-5" />
                    )}
                  </span>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox checked={isChecked} onChange={setIsChecked} />
                  <span className="block font-normal text-[#EE4E34] text-theme-sm">
                    Keep me logged in
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="w-full">
                <button
                  type="submit"
                  disabled={isLoginIn}
                  className={`w-full py-3 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#EE4E34] focus:ring-opacity-75 transition duration-200 ease-in-out
      ${
        isLoginIn
          ? "bg-[#EE4E34]/70 text-white cursor-not-allowed"
          : "bg-[#EE4E34] text-white hover:bg-[#d3452f] cursor-pointer"
      }`}
                >
                  {isLoginIn ? "Logging.." : "Login"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
