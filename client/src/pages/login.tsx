import React, { useState, useEffect } from "react";
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

  // Update stats at regular intervals
  useEffect(() => {
    const updateStats = () => {
      // Update platform stats
      setStats(prevStats => 
        prevStats.map(stat => {
          // Random increment between 1-5
          const increment = Math.floor(Math.random() * 5) + 1;
          const newValue = stat.initialValue + increment;
          
          return {
            ...stat,
            initialValue: newValue,
            value: new Intl.NumberFormat('en-US').format(newValue)
          };
        })
      );

      // Update market stats
      setMarketStats(prevStats => 
        prevStats.map((stat, index) => {
          let newValue;
          let formattedValue;
          
          if (index === 1 || index === 2) {
            // For currency values (in millions)
            const increment = (Math.random() * 0.03).toFixed(2);
            newValue = parseFloat((stat.initialValue + parseFloat(increment)).toFixed(2));
            formattedValue = `₦${newValue}M`;
          } else {
            // For count values
            const increment = Math.floor(Math.random() * 3) + 1;
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

    // Update every 3 seconds
    const intervalId = setInterval(updateStats, 3000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen flex font-sans antialiased">
      <Sidebar isOpen={false} onClose={() => {}} />
      
      <div className="flex-1 overflow-hidden bg-black">
        <div className="overflow-auto h-screen">
          <div className="container mx-auto px-4 py-6">
            {/* Site Name and Stats - First Elements */}
            <div className="text-center mb-8">
              <h1 className="text-5xl lg:text-6xl font-extrabold mb-4 vibrant-gradient-text">
                ETHERVOXSMS
              </h1>
              <p className="text-xl text-purple-300 mb-4">The premium virtual number marketplace with integrated rewards system</p>
            </div>
            
            {/* Market Stats - Second Element */}
            <div className="glowing-card p-4 mb-10 max-w-4xl mx-auto">
              <h3 className="text-xl font-bold mb-3 rainbow-text text-center">Real-Time Market Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {marketStats.map((stat, index) => (
                  <div key={index} className="bg-purple-900/20 p-3 rounded-lg border border-purple-500/20">
                    <div className="flex justify-between">
                      <span className="text-gray-300 text-sm">{stat.label}</span>
                      <span className="text-green-400 text-xs font-semibold">{stat.trend}</span>
                    </div>
                    <p className="text-xl font-bold vibrant-gradient-text live-counter">{stat.value}</p>
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
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div 
                        className="stats-circle-vibrant w-20 h-20 mx-auto mb-2"
                        style={{ 
                          "--percentage": `${stat.percent}%`,
                          "--percentage-double": `${stat.percent * 2}%`
                        } as React.CSSProperties}
                      >
                        <div className="absolute inset-2 rounded-full bg-gray-900 flex items-center justify-center">
                          <stat.icon className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <h3 className="text-white font-bold stats-value text-lg live-counter">{stat.value}</h3>
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
              {/* WhatsApp Contact Gain Section */}
              <div className="mt-12 glowing-card p-6">
                <h3 className="text-2xl font-bold mb-4 text-center">
                  <span className="neon-text">Premium WhatsApp Access</span>
                </h3>
                <div className="flex items-center justify-center mb-6">
                  <MessageCircle className="w-12 h-12 text-green-500 mr-3" />
                  <div className="text-center">
                    <p className="text-xl text-white mb-1">Gain Access to Over</p>
                    <p className="text-3xl font-bold vibrant-gradient-text live-counter">1,200,000+</p>
                    <p className="text-xl text-white">Active WhatsApp Users</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <p className="text-purple-200 text-center">Connect with genuine global WhatsApp numbers for your business and personal needs.</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-purple-900/20 p-3 rounded-lg border border-purple-500/20 text-center">
                      <p className="text-white text-sm mb-1">Business Verified</p>
                      <p className="text-lg font-bold text-green-400 live-counter">98.7%</p>
                    </div>
                    <div className="bg-purple-900/20 p-3 rounded-lg border border-purple-500/20 text-center">
                      <p className="text-white text-sm mb-1">Delivery Success</p>
                      <p className="text-lg font-bold text-green-400 live-counter">99.3%</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* VIP Access Section */}
              <div className="mt-12 vip-access-card p-6">
                <div className="flex items-center mb-4 justify-center">
                  <Star className="w-8 h-8 text-yellow-400 mr-2" />
                  <h3 className="text-2xl font-bold text-yellow-300">VIP Access Program</h3>
                  <Lock className="w-6 h-6 text-yellow-400 ml-2" />
                </div>
                
                <p className="text-white text-center mb-6">
                  Join our exclusive VIP program for premium access to all WhatsApp numbers and receive priority verification.
                </p>
                
                <div className="bg-purple-900/40 p-4 rounded-lg border border-yellow-500/30 mb-6">
                  <h4 className="text-lg font-bold text-yellow-200 mb-2">Premium Benefits Include:</h4>
                  <ul className="space-y-2 text-white">
                    <li className="flex items-start">
                      <span className="text-yellow-400 mr-2">•</span>
                      <span>Access to all 90+ countries' WhatsApp numbers</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-400 mr-2">•</span>
                      <span>List your own number and earn commission</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-400 mr-2">•</span>
                      <span>Priority verification and support</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-400 mr-2">•</span>
                      <span>Bulk discounts and special offers</span>
                    </li>
                  </ul>
                </div>
                
                <div className="text-center">
                  <p className="text-yellow-200 font-bold mb-2">One-time VIP Access Fee:</p>
                  <p className="text-3xl font-bold text-yellow-300 mb-4">₦2,000</p>
                  <Link to="/vip-access">
                    <Button className="w-full bg-gradient-to-r from-yellow-600 to-yellow-400 hover:from-yellow-500 hover:to-yellow-300 text-black font-bold">
                      Join VIP Program
                    </Button>
                  </Link>
                  <p className="text-xs text-yellow-200/70 mt-2">Admin verification required after payment</p>
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
