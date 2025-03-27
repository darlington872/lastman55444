import React from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

// Shared loading component that fits our theme
const LoadingScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-black">
    <div className="relative w-20 h-20">
      <div className="absolute inset-0 rounded-full border-4 border-purple-800/20"></div>
      <div className="absolute inset-0 rounded-full border-t-4 border-r-4 border-purple-600 animate-spin"></div>
      <div className="absolute inset-0 rounded-full border-4 border-transparent flex items-center justify-center">
        <p className="text-purple-400 font-bold">ETHER</p>
      </div>
    </div>
    <p className="text-purple-300 mt-4 animate-pulse">Loading...</p>
  </div>
);

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();

  React.useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/login");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return user ? <>{children}</> : null;
};

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();

  React.useEffect(() => {
    if (!isLoading) {
      if (!user) {
        setLocation("/login");
      } else if (!user.isAdmin) {
        setLocation("/dashboard");
      }
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return user && user.isAdmin ? <>{children}</> : null;
};
