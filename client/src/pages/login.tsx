import React from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/ui/sidebar";
import Login from "@/components/auth/Login";
import { 
  Users, 
  BadgeCheck, 
  BarChart3, 
  Globe2, 
  ShieldCheck, 
  Sparkles, 
  BriefcaseBusiness,
  Smartphone,
  Shuffle
} from "lucide-react";

const LoginPage: React.FC = () => {
  const [location] = useLocation();
  const { user } = useAuth();
  
  // If user is already logged in, redirect to dashboard
  React.useEffect(() => {
    if (user) {
      window.location.href = "/dashboard";
    }
  }, [user]);

  // Fake platform stats
  const stats = [
    { label: "Active Users", value: "12,451", icon: Users, percent: 75 },
    { label: "WhatsApp Numbers", value: "58,300", icon: Smartphone, percent: 85 },
    { label: "Markets Served", value: "91", icon: Globe2, percent: 90 },
    { label: "Trusted Vendors", value: "1,580", icon: BadgeCheck, percent: 80 },
  ];
  
  // Fake market stats that look realistic
  const marketStats = [
    { label: "Daily Transactions", value: "1,209", trend: "+12.5%" },
    { label: "Monthly Revenue", value: "₦29.5M", trend: "+8.2%" },
    { label: "Referral Payouts", value: "₦2.12M", trend: "+4.3%" },
    { label: "New Signups (24h)", value: "294", trend: "+15.8%" },
  ];

  return (
    <div className="min-h-screen flex font-sans antialiased">
      <Sidebar isOpen={false} onClose={() => {}} />
      
      <div className="flex-1 overflow-hidden bg-black">
        <div className="overflow-auto h-screen">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Login Form */}
              <div className="md:order-2">
                <div className="max-w-md mx-auto">
                  <Login />
                </div>
              </div>
              
              {/* Hero Content */}
              <div className="md:order-1 space-y-6">
                <div>
                  <h1 className="text-4xl lg:text-5xl font-extrabold mb-4">
                    <span className="neon-text">Welcome Back</span>
                  </h1>
                  <p className="text-xl text-purple-300 mb-8">The premium WhatsApp number marketplace with integrated rewards and AI assistance.</p>
                </div>
                
                {/* Circular Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div 
                        className="stats-circle-vibrant w-24 h-24 mx-auto mb-3"
                        style={{ 
                          "--percentage": `${stat.percent}%`,
                          "--percentage-double": `${stat.percent * 2}%`
                        } as React.CSSProperties}
                      >
                        <div className="absolute inset-2 rounded-full bg-gray-900 flex items-center justify-center">
                          <stat.icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <h3 className="text-white font-bold stats-value text-xl">{stat.value}</h3>
                      <p className="text-purple-300 text-sm">{stat.label}</p>
                    </div>
                  ))}
                </div>
                
                {/* Market Stats */}
                <div className="glowing-card p-4">
                  <h3 className="text-xl font-bold mb-3 rainbow-text">Real-Time Market Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {marketStats.map((stat, index) => (
                      <div key={index} className="bg-purple-900/20 p-3 rounded-lg border border-purple-500/20">
                        <div className="flex justify-between">
                          <span className="text-gray-300 text-sm">{stat.label}</span>
                          <span className="text-green-400 text-xs font-semibold">{stat.trend}</span>
                        </div>
                        <p className="text-xl font-bold vibrant-gradient-text">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Feature Badges */}
                <div className="flex flex-wrap gap-3 mt-4">
                  <span className="bg-purple-900/30 text-purple-300 text-xs font-medium px-3 py-1 rounded-full border border-purple-500/30 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> Secure Payments
                  </span>
                  <span className="bg-blue-900/30 text-blue-300 text-xs font-medium px-3 py-1 rounded-full border border-blue-500/30 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> ₦100 Per Referral
                  </span>
                  <span className="bg-indigo-900/30 text-indigo-300 text-xs font-medium px-3 py-1 rounded-full border border-indigo-500/30 flex items-center gap-1">
                    <BriefcaseBusiness className="h-3 w-3" /> Verified Vendors
                  </span>
                  <span className="bg-fuchsia-900/30 text-fuchsia-300 text-xs font-medium px-3 py-1 rounded-full border border-fuchsia-500/30 flex items-center gap-1">
                    <Shuffle className="h-3 w-3" /> Instant Delivery
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
