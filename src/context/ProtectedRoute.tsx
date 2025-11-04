import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  

  if (!isAuthenticated) {
    // Redirect unauthenticated users to sign-in page
    return <Navigate to="/signin" replace />;
  }

  // User is authenticated, render the protected component
  return children;
}
