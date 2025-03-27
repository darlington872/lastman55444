import React from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/ui/sidebar";
import Register from "@/components/auth/Register";

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-gray-50 font-sans antialiased">
      <Sidebar isOpen={false} onClose={() => {}} />
      
      <div className="flex-1 overflow-hidden">
        <div className="overflow-auto h-screen pb-24 px-4 md:px-6">
          <Register />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
