import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { isAuthenticated } from "@/utils/auth";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(isAuthenticated());
    setAuthChecked(true);
  }, []);

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuth) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
