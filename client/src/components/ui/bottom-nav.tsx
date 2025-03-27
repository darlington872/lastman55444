import React from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

const BottomNav: React.FC = () => {
  const { user } = useAuth();
  const [location, navigate] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  if (!user) return null; // Don't show bottom nav if not logged in

  // Core navigation items for the bottom nav
  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      name: "Buy",
      path: "/store",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
        </svg>
      ),
    },
    {
      name: "Referrals",
      path: "/referrals",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
    },
    {
      name: "KYC",
      path: "/kyc",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: "More",
      path: "#",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      ),
      onClick: () => handleNavigation("/more"),
    },
  ];

  // If user is admin, add admin icon to the "More" button
  if (user.isAdmin) {
    navItems[4].icon = (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
      </svg>
    );
    navItems[4].onClick = () => navigate("/admin");
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-purple-600/30 backdrop-blur-md bg-opacity-80 px-2 py-1 shadow-lg">
      {/* Glassmorphic effect elements */}
      <div className="absolute -top-24 left-1/4 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-10 right-1/4 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 flex justify-around items-center">
        {navItems.map((item) => (
          <button
            key={item.name}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-all ${
              (isActive(item.path) || 
               (item.path === "/dashboard" && isActive("/"))) ? 
                "text-purple-400" : "text-gray-400 hover:text-purple-300"
            }`}
            onClick={() => item.onClick ? item.onClick() : handleNavigation(item.path)}
          >
            <div className="p-1.5 bg-gradient-to-br from-purple-900/20 to-black/30 rounded-lg border border-purple-600/30 backdrop-blur-sm mb-1">
              {item.icon}
            </div>
            <span className="text-xs font-medium">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;