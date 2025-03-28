import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Shuffle,
  Lock,
  Star,
  MessageCircle
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

  // Platform stats with initial values
  const [stats, setStats] = useState([
    { label: "Active Users", value: "12,451", initialValue: 12451, icon: Users, percent: 75 },
    { label: "Virtual Numbers", value: "58,300", initialValue: 58300, icon: Smartphone, percent: 85 },
    { label: "Markets Served", value: "91", initialValue: 91, icon: Globe2, percent: 90 },
    { label: "Trusted Vendors", value: "1,580", initialValue: 1580, icon: BadgeCheck, percent: 80 },
  ]);
  
  // Market stats with initial values
  const [marketStats, setMarketStats] = useState([
    { label: "Daily Transactions", value: "1,209", initialValue: 1209, trend: "+12.5%" },
    { label: "Monthly Revenue", value: "₦29.5M", initialValue: 29.5, trend: "+8.2%" },
    { label: "Referral Payouts", value: "₦2.12M", initialValue: 2.12, trend: "+4.3%" },
    { label: "New Signups (24h)", value: "294", initialValue: 294, trend: "+15.8%" },
  ]);

  // WhatsApp active users counter
  const [whatsappUsers, setWhatsappUsers] = useState(1_200_000);
  
  // Update WhatsApp users counter separately (with faster updates)
  useEffect(() => {
    const whatsappIntervalId = setInterval(() => {
      setWhatsappUsers(prevCount => {
        // Random increment between 50-350
        const increment = Math.floor(Math.random() * 300) + 50;
        return prevCount + increment;
      });
    }, 3500); // Update a bit faster than other stats for attention-grabbing effect
    
    return () => clearInterval(whatsappIntervalId);
  }, []);
  
  // Update stats at regular intervals - optimized for performance
  useEffect(() => {
    // Initial update after a slight delay to improve perceived performance
    const initialUpdateTimeout = setTimeout(() => {
      updateStats();
    }, 1500);
    
    // Update every 5 seconds to reduce load
    const intervalId = setInterval(updateStats, 5000);
    
    // Function to update stats in order (like a graph progression)
    function updateStats() {
      // First update platform stats in a progressive manner
      setStats(prevStats => {
        // Sort by initialValue and increment proportionally
        const sortedStats = [...prevStats].sort((a, b) => a.initialValue - b.initialValue);
        
        return prevStats.map(stat => {
          // Smaller values get incremented more to catch up to larger values - simulating trending graph data
          const multiplier = Math.max(0.5, Math.min(1.5, 100000 / stat.initialValue));
          const increment = Math.floor(Math.random() * 3 * multiplier) + 1;
          const newValue = stat.initialValue + increment;
          
          return {
            ...stat,
            initialValue: newValue,
            value: new Intl.NumberFormat('en-US').format(newValue)
          };
        });
      });

      // Then update market stats
      setMarketStats(prevStats => 
        prevStats.map((stat, index) => {
          let newValue;
          let formattedValue;
          
          if (index === 1 || index === 2) {
            // For currency values (in millions)
            const increment = (Math.random() * 0.02).toFixed(2);
            newValue = parseFloat((stat.initialValue + parseFloat(increment)).toFixed(2));
            formattedValue = `₦${newValue}M`;
          } else {
            // For count values - more predictable progression
            const increment = Math.floor(Math.random() * 2) + 1;
            newValue = stat.initialValue + increment;
            formattedValue = new Intl.NumberFormat('en-US').format(newValue);
          }
          
          return {
            ...stat,
            initialValue: newValue,
            value: formattedValue
          };
        })
      );
    };
    
    return () => {
      clearTimeout(initialUpdateTimeout);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black font-sans antialiased">
      <div className="container mx-auto px-4 py-6">
        {/* Site Name and Stats - First Elements */}
        <div className="text-center mb-8">
          <div className="logo-container">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-0 vibrant-gradient-text leading-tight">
              ETHERVOX
            </h1>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-purple-400 mb-4">SMS</h2>
          </div>
          <p className="text-lg sm:text-xl text-purple-300 mb-4">Premium virtual number marketplace with integrated rewards system</p>
        </div>
        
        {/* Market Stats - Second Element */}
        <div className="glowing-card p-4 mb-10 max-w-4xl mx-auto">
          <h3 className="text-lg sm:text-xl font-bold mb-3 rainbow-text text-center">Real-Time Market Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
            {marketStats.map((stat, index) => (
              <div key={index} className="bg-purple-900/20 p-2 sm:p-3 rounded-lg border border-purple-500/20">
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="text-gray-300 text-xs sm:text-sm">{stat.label}</span>
                  <span className="text-green-400 text-xs font-semibold">{stat.trend}</span>
                </div>
                <p className="text-lg sm:text-xl font-bold vibrant-gradient-text live-counter" style={{ minWidth: '60px', display: 'inline-block' }}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Login Form and Hero Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Login Form */}
          <div className="md:order-2">
            <div className="max-w-md mx-auto">
              <Login />
            </div>
          </div>
          
          {/* Hero Content */}
          <div className="md:order-1 space-y-6">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                <span className="neon-text">Welcome Back</span>
              </h2>
              <p className="text-lg text-purple-300 mb-6">Access your account to manage orders and referrals.</p>
            </div>
            
            {/* Circular Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div 
                    className="stats-circle-vibrant w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2"
                    style={{ 
                      "--percentage": `${stat.percent}%`,
                      "--percentage-double": `${stat.percent * 2}%`
                    } as React.CSSProperties}
                  >
                    <div className="absolute inset-2 rounded-full bg-gray-900 flex items-center justify-center">
                      <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                  </div>
                  <h3 className="text-white font-bold stats-value text-lg live-counter" style={{ minWidth: '75px', display: 'inline-block' }}>{stat.value}</h3>
                  <p className="text-purple-300 text-xs">{stat.label}</p>
                </div>
              ))}
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
          {/* Additional Value Proposition */}
          <div className="mt-12 glowing-card p-4 sm:p-6">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-center">
              <span className="neon-text">Premium SMS Marketplace</span>
            </h3>
            <div className="flex flex-col sm:flex-row items-center justify-center mb-6 text-center">
              <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-500 mb-2 sm:mb-0 sm:mr-3" />
              <div className="text-center">
                <p className="text-lg sm:text-xl text-white mb-1">Join Our Network of</p>
                <p className="text-2xl sm:text-3xl font-bold vibrant-gradient-text live-counter" style={{ minWidth: '175px', display: 'inline-block' }}>
                  {new Intl.NumberFormat('en-US').format(whatsappUsers)}+
                </p>
                <p className="text-lg sm:text-xl text-white">Active Users</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <p className="text-purple-200 text-center text-sm sm:text-base">Connect with our global community for your business and personal needs.</p>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="bg-purple-900/20 p-2 sm:p-3 rounded-lg border border-purple-500/20 text-center">
                  <p className="text-white text-xs sm:text-sm mb-1">Business Verified</p>
                  <p className="text-base sm:text-lg font-bold text-green-400 live-counter">98.7%</p>
                </div>
                <div className="bg-purple-900/20 p-2 sm:p-3 rounded-lg border border-purple-500/20 text-center">
                  <p className="text-white text-xs sm:text-sm mb-1">Delivery Success</p>
                  <p className="text-base sm:text-lg font-bold text-green-400 live-counter">99.3%</p>
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