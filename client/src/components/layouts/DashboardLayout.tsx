import React, { useState } from "react";
import Sidebar from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  adminMode?: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children,
  title,
  adminMode = false
}) => {
  const { user } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-black font-sans antialiased">
      <Sidebar 
        isOpen={mobileSidebarOpen} 
        onClose={() => setMobileSidebarOpen(false)} 
        adminMode={adminMode} 
      />
      
      <div className="flex-1 overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden bg-black border-b border-purple-900/40 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="text-white hover:text-purple-400 mr-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="text-lg font-bold text-white bg-gradient-to-r from-purple-600 to-blue-400 text-transparent bg-clip-text">EtherDoxShefZySMS</h1>
          </div>
          {user && (
            <div>
              <span className="text-purple-400 text-sm font-medium">{user.username}</span>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="overflow-auto h-screen pb-24 px-4 md:px-6 bg-black text-white">
          <div className="py-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-400 text-transparent bg-clip-text">{title}</h1>
              {adminMode && (
                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-900/40 text-red-400 border border-red-500/20">
                  Admin Mode
                </span>
              )}
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
