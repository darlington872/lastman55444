import React from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

interface BottomNavProps {
  adminMode?: boolean;
}

const BottomNav: React.FC<BottomNavProps> = ({ adminMode = false }) => {
  const { user, logout } = useAuth();
  const [location, navigate] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Handle logout with confirmation
  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      logout();
    }
  };

  // Show admin menu for admin users
  const showAdminMenu = user?.isAdmin;

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-black border-t border-purple-600/40 backdrop-blur-md bg-opacity-80">
      <div className="grid h-full grid-cols-5 mx-auto max-w-lg">
        {/* Dashboard */}
        <button
          type="button"
          onClick={() => handleNavigation("/dashboard")}
          className={`inline-flex flex-col items-center justify-center px-5 hover:bg-black group ${
            isActive("/dashboard") || isActive("/")
              ? "bg-gradient-to-t from-purple-900/60 to-black border-t-2 border-purple-600"
              : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-6 h-6 mb-1 ${
              isActive("/dashboard") || isActive("/")
                ? "text-purple-400"
                : "text-gray-400 group-hover:text-white"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span
            className={`text-xs ${
              isActive("/dashboard") || isActive("/")
                ? "text-purple-400"
                : "text-gray-400 group-hover:text-white"
            }`}
          >
            Home
          </span>
        </button>

        {/* Referrals */}
        <button
          type="button"
          onClick={() => handleNavigation("/referrals")}
          className={`inline-flex flex-col items-center justify-center px-5 hover:bg-black group ${
            isActive("/referrals")
              ? "bg-gradient-to-t from-purple-900/60 to-black border-t-2 border-purple-600"
              : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-6 h-6 mb-1 ${
              isActive("/referrals")
                ? "text-purple-400"
                : "text-gray-400 group-hover:text-white"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
          <span
            className={`text-xs ${
              isActive("/referrals")
                ? "text-purple-400"
                : "text-gray-400 group-hover:text-white"
            }`}
          >
            Referrals
          </span>
        </button>

        {/* Store */}
        <button
          type="button"
          onClick={() => handleNavigation("/store")}
          className={`inline-flex flex-col items-center justify-center px-5 hover:bg-black group ${
            isActive("/store")
              ? "bg-gradient-to-t from-purple-900/60 to-black border-t-2 border-purple-600"
              : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-6 h-6 mb-1 ${
              isActive("/store")
                ? "text-purple-400"
                : "text-gray-400 group-hover:text-white"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          </svg>
          <span
            className={`text-xs ${
              isActive("/store")
                ? "text-purple-400"
                : "text-gray-400 group-hover:text-white"
            }`}
          >
            Store
          </span>
        </button>

        {/* VIP Access */}
        <button
          type="button"
          onClick={() => handleNavigation("/vip-access")}
          className={`inline-flex flex-col items-center justify-center px-5 hover:bg-black group ${
            isActive("/vip-access")
              ? "bg-gradient-to-t from-yellow-900/60 to-black border-t-2 border-yellow-500"
              : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-6 h-6 mb-1 ${
              isActive("/vip-access")
                ? "text-yellow-400"
                : "text-gray-400 group-hover:text-white"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span
            className={`text-xs ${
              isActive("/vip-access")
                ? "text-yellow-400"
                : "text-gray-400 group-hover:text-white"
            }`}
          >
            VIP
          </span>
        </button>

        {/* More Menu (Admin or Profile) */}
        {showAdminMenu ? (
          <button
            type="button"
            onClick={() => handleNavigation("/admin")}
            className={`inline-flex flex-col items-center justify-center px-5 hover:bg-black group ${
              isActive("/admin") || isActive("/admin/stock") || isActive("/admin/users") || 
              isActive("/admin/payments") || isActive("/admin/broadcast") || isActive("/admin/settings")
                ? "bg-gradient-to-t from-red-900/60 to-black border-t-2 border-red-500"
                : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-6 h-6 mb-1 ${
                isActive("/admin") || isActive("/admin/stock") || isActive("/admin/users") || 
                isActive("/admin/payments") || isActive("/admin/broadcast") || isActive("/admin/settings")
                  ? "text-red-400"
                  : "text-red-500 group-hover:text-red-400"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                clipRule="evenodd"
              />
            </svg>
            <span
              className={`text-xs ${
                isActive("/admin") || isActive("/admin/stock") || isActive("/admin/users") || 
                isActive("/admin/payments") || isActive("/admin/broadcast") || isActive("/admin/settings")
                  ? "text-red-400"
                  : "text-red-500 group-hover:text-red-400"
              }`}
            >
              Admin
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleNavigation("/kyc")}
            className={`inline-flex flex-col items-center justify-center px-5 hover:bg-black group ${
              isActive("/kyc")
                ? "bg-gradient-to-t from-purple-900/60 to-black border-t-2 border-purple-600"
                : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-6 h-6 mb-1 ${
                isActive("/kyc")
                  ? "text-purple-400"
                  : "text-gray-400 group-hover:text-white"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span
              className={`text-xs ${
                isActive("/kyc")
                  ? "text-purple-400"
                  : "text-gray-400 group-hover:text-white"
              }`}
            >
              Profile
            </span>
          </button>
        )}

        {/* Admin Menu Popup - Only shown when needed */}
        {showAdminMenu && isActive("/admin") && (
          <div className="fixed bottom-16 right-0 w-40 bg-black border border-purple-600/40 rounded-tl-lg shadow-lg backdrop-blur-md bg-opacity-90 z-50">
            <ul className="py-1 text-sm text-gray-200">
              <li>
                <a
                  href="#"
                  onClick={() => handleNavigation("/admin/stock")}
                  className="block px-4 py-2 hover:bg-purple-900/30"
                >
                  Stock Management
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => handleNavigation("/admin/users")}
                  className="block px-4 py-2 hover:bg-purple-900/30"
                >
                  User Management
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => handleNavigation("/admin/payments")}
                  className="block px-4 py-2 hover:bg-purple-900/30"
                >
                  Payment Verification
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => handleNavigation("/admin/broadcast")}
                  className="block px-4 py-2 hover:bg-purple-900/30"
                >
                  Broadcast Message
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => handleNavigation("/admin/settings")}
                  className="block px-4 py-2 hover:bg-purple-900/30"
                >
                  System Settings
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={handleLogout}
                  className="block px-4 py-2 text-red-400 hover:bg-red-900/30"
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default BottomNav;