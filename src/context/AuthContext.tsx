import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { useLoginAdminMutation } from "../redux/api/authApi";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginAdmin] = useLoginAdminMutation();

  const checkAuth = useCallback(() => {
    try {
      const token = localStorage.getItem("qms_admin_token");
      const storedUser = localStorage.getItem("qms_admin_user");

      console.log("🔍 Auth Check:", { token: !!token, hasUser: !!storedUser });

      if (token && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log("✅ Parsed User:", parsedUser);
        setUser(parsedUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Auth parse error:", error);
      localStorage.removeItem("qms_admin_user");
      localStorage.removeItem("qms_admin_token");
      setUser(null);
      return false;
    }
  }, []);

  useEffect(() => {
    checkAuth();
    setIsLoading(false);
  }, [checkAuth]);

  async function login(data: any) {
    console.log("Login Data Received:", data);

    try {
      const response = await loginAdmin(data).unwrap();
      console.log("Login API Response:", response);

      localStorage.setItem("qms_admin_token", response?.token || "");
      localStorage.setItem(
        "qms_admin_user",
        JSON.stringify(response?.user || {})
      );

      setUser(response?.user);
      toast.success("Login successful!");

      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error?.message || "Login failed! Please check credentials.");
      return { success: false, error };
    }
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("qms_admin_user");
    localStorage.removeItem("qms_admin_token");
    toast.info("Logged out successfully");
  }

  useEffect(() => {
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [checkAuth]);

  const isAuthenticated = !!user;

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    isLoading,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
