import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Get the current host URL for dynamic referral links
const getHostUrl = () => {
  return window.location.origin;
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  getReferralLink: (referralCode: string) => string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  referredBy?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/user/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // If token is invalid, clear it
        localStorage.removeItem("token");
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log("Sending login request with:", { email });
      
      const response = await apiRequest("POST", "/api/auth/login", { email, password });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Login failed");
      }
      
      const data = await response.json();
      console.log("Login response:", data);
      
      if (data.token) {
        localStorage.setItem("token", data.token);
        setUser(data.user);
        
        toast({
          title: "Logged in successfully",
          description: `Welcome back, ${data.user.fullName}!`,
        });
      } else {
        throw new Error("No authentication token received from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      console.log("Sending register request with data:", userData);
      
      const response = await apiRequest("POST", "/api/auth/register", userData);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Registration failed");
      }
      
      const data = await response.json();
      console.log("Registration response:", data);
      
      if (data.token) {
        localStorage.setItem("token", data.token);
        setUser(data.user);
        
        toast({
          title: "Registration successful",
          description: `Welcome, ${data.user.fullName}!`,
        });
      } else {
        throw new Error("No authentication token received from server");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please check your information and try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    // Clear all queries in the cache
    queryClient.clear();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  // Function to generate a referral link with the current domain
  const getReferralLink = (referralCode: string) => {
    return `${getHostUrl()}/register?ref=${referralCode}`;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, getReferralLink }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
