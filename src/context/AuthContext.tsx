import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginAdminMutation } from "../redux/api/authApi";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loginAdmin] = useLoginAdminMutation();

  // ✅ Login function: uses form data
  async function login(data: any) {
    console.log("Login Data Received:", data);

    try {
      const response = await loginAdmin(data).unwrap();
      console.log("Login API Response:", response);

      // Save user & token in localStorage
      localStorage.setItem("qms_admin_token", response?.token);
      localStorage.setItem("qms_admin_user", JSON.stringify(response?.user));

      // Update user state
      setUser(response?.user);

      toast.success("Login successful!");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(
        error?.message || "Login failed! Please check credentials."
      );
    }
  }

  // ✅ Logout function
  function logout() {
    setUser(null);
    localStorage.removeItem("qms_admin_user");
    localStorage.removeItem("qms_admin_token");
    toast.info("Logged out successfully");
  }

  // ✅ Check user & token on mount
  useEffect(() => {
    const token = localStorage.getItem("qms_admin_token");
    const storedUser = localStorage.getItem("qms_admin_user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, []);

  // ✅ Authentication status
  const isAuthenticated = !!localStorage.getItem("qms_admin_token");

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
