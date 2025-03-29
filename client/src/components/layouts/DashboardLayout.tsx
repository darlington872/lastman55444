import React from "react";
import BottomNav from "@/components/ui/bottom-nav";
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

  return (
    <div className="min-h-screen flex flex-col bg-black font-sans antialiased">
      {/* Header */}
      <div className="bg-black border-b border-purple-600/40 p-4 flex items-center justify-between backdrop-blur-md bg-opacity-80 shadow-md sticky top-0 z-30">
        <h1 className="text-lg font-bold vibrant-gradient-text">ETHERVOX</h1>
        {user && (
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 text-xs leading-5 font-semibold rounded-full bg-purple-900/30 text-purple-300 border border-purple-600/30">
              ₦{user.balance.toFixed(2)}
            </span>
            <span className="hidden sm:inline-block text-purple-400 text-sm font-medium">{user.username}</span>
          </div>
        )}
      </div>

      {/* Content Area - Added padding at bottom to prevent content from being hidden behind bottom nav */}
      <div className="flex-1 overflow-y-auto px-3 md:px-6 bg-black text-white pb-24">
        <div className="py-4">
          <div className="flex flex-wrap justify-between items-center mb-6">
            <h1 className="text-xl md:text-2xl font-bold vibrant-gradient-text my-2">{title}</h1>
            {adminMode && (
              <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-red-900/40 to-purple-900/40 text-red-400 border border-red-500/30 shadow-inner shadow-red-700/10">
                Admin Mode
              </span>
            )}
          </div>
          <div className="space-y-6 mb-6">
            {children}
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNav adminMode={adminMode} />
    </div>
  );
};

export default DashboardLayout;