import React, { useState, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(false);

  // Handle screen size changes for responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileSidebarOpen(false);
      }
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = mobileSidebarOpen ? 'hidden' : 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileSidebarOpen, isMobile]);

  // Toggle sidebar function with console log for debugging
  const toggleSidebar = () => {
    console.log("Toggle sidebar clicked. Current state:", mobileSidebarOpen);
    setMobileSidebarOpen(prevState => !prevState);
  };

  // Log state changes for debugging
  useEffect(() => {
    console.log("DashboardLayout sidebar state updated:", mobileSidebarOpen);
  }, [mobileSidebarOpen]);

  return (
    <div className="min-h-screen flex bg-black font-sans antialiased">
      {/* Removed backdrop overlay - now handled in the Sidebar component */}
    
      <Sidebar 
        isOpen={mobileSidebarOpen} 
        onClose={() => setMobileSidebarOpen(false)} 
        adminMode={adminMode} 
      />
      
      <div className="flex-1 overflow-hidden">
        {/* Mobile Header - Enhanced */}
        <div className="md:hidden bg-black border-b border-purple-600/40 p-4 flex items-center justify-between backdrop-blur-md bg-opacity-80 shadow-md sticky top-0 z-30">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              type="button"
              aria-label="Toggle menu"
              className="text-white hover:text-purple-400 mr-3 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/50 p-2 rounded-md bg-purple-900/20"
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
            <h1 className="text-lg font-bold vibrant-gradient-text">ETHERDOXSHEFZYSMS</h1>
          </div>
          {user && (
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 text-xs leading-5 font-semibold rounded-full bg-purple-900/30 text-purple-300 border border-purple-600/30">
                ₦{user.balance.toFixed(2)}
              </span>
              <span className="hidden sm:inline-block text-purple-400 text-sm font-medium">{user.username}</span>
            </div>
          )}
        </div>

        {/* Content Area - Enhanced */}
        <div className="overflow-auto h-screen md:h-auto pb-24 pt-0 md:pt-6 px-3 md:px-6 bg-black text-white">
          <div className="py-4 md:py-6">
            <div className="flex flex-wrap justify-between items-center mb-6">
              <h1 className="text-xl md:text-2xl font-bold vibrant-gradient-text my-2">{title}</h1>
              {adminMode && (
                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-red-900/40 to-purple-900/40 text-red-400 border border-red-500/30 shadow-inner shadow-red-700/10">
                  Admin Mode
                </span>
              )}
            </div>
            <div className="space-y-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
