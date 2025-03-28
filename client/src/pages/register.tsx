import React from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/ui/sidebar";
import Register from "@/components/auth/Register";
import { 
  Zap, 
  BadgeCheck, 
  TrendingUp, 
  Headphones, 
  ShieldCheck, 
  Sparkles, 
  CircleDollarSign,
  Lock,
  Smartphone,
  Users,
  Globe2,
  MessageCircle,
  Star
} from "lucide-react";

const RegisterPage: React.FC = () => {
  const [location] = useLocation();
  const { user } = useAuth();
  
  // If user is already logged in, redirect to dashboard
  React.useEffect(() => {
    if (user) {
      window.location.href = "/dashboard";
    }
  }, [user]);

  // Platform benefits
  const benefits = [
    { title: "Premium Numbers", description: "Access to exclusive virtual numbers from 90+ countries", icon: Smartphone },
    { title: "Instant Activation", description: "Numbers are delivered and activated within minutes", icon: Zap },
    { title: "Earn With Referrals", description: "Get ₦100 for each user you refer to our platform", icon: CircleDollarSign },
    { title: "24/7 Support", description: "Get help anytime with our ETHERVOX AI assistant", icon: Headphones },
  ];

  // Platform stats for trust signals with progressive graph-like increments
  const [stats, setStats] = React.useState([
    { label: "Active Users", value: "12,451+", initialValue: 12451, icon: Users },
    { label: "Global Reach", value: "90+ Countries", initialValue: 90, icon: Globe2 },
    { label: "Success Rate", value: "98%", initialValue: 98, icon: BadgeCheck },
  ]);
  
  // Update stats in a progressive graph-like pattern - optimized for performance
  React.useEffect(() => {
    // Initial update after slight delay to improve perceived performance
    const initialUpdateTimeout = setTimeout(() => {
      updateStats();
    }, 2000);
    
    // Update less frequently on register page
    const intervalId = setInterval(updateStats, 7000);
    
    function updateStats() {
      setStats(prevStats => {
        return prevStats.map(stat => {
          // For users - increase more (to show growth)
          if (stat.label === "Active Users") {
            const increment = Math.floor(Math.random() * 5) + 1;
            const newValue = stat.initialValue + increment;
            return {
              ...stat,
              initialValue: newValue,
              value: `${new Intl.NumberFormat('en-US').format(newValue)}+`
            };
          }
          // For countries - small chance to increase (new market expansion)
          else if (stat.label === "Global Reach") {
            // Only 10% chance to add a new country
            if (Math.random() < 0.1) {
              const newValue = stat.initialValue + 1;
              return {
                ...stat,
                initialValue: newValue,
                value: `${newValue}+ Countries`
              };
            }
            return stat;
          }
          // For success rate - even smaller change within upper bound (98.5% max)
          else if (stat.label === "Success Rate") {
            // Only 5% chance to increase success rate
            if (Math.random() < 0.05 && stat.initialValue < 98.5) {
              const newValue = Math.min(98.5, stat.initialValue + 0.1);
              return {
                ...stat,
                initialValue: newValue,
                value: `${newValue.toFixed(1)}%`
              };
            }
            return stat;
          }
          return stat;
        });
      });
    }
    
    return () => {
      clearTimeout(initialUpdateTimeout);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="min-h-screen flex font-sans antialiased">
      <Sidebar isOpen={false} onClose={() => {}} />
      
      <div className="flex-1 overflow-hidden bg-black">
        <div className="overflow-auto h-screen">
          <div className="container mx-auto px-4 py-6">
            {/* Site Name - First Element */}
            <div className="text-center mb-8">
              <div className="logo-container">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-0 vibrant-gradient-text leading-tight">
                  ETHERVOX
                </h1>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-purple-400 mb-4">SMS</h2>
              </div>
              <p className="text-lg sm:text-xl text-purple-300 mb-4">Premium virtual number marketplace with integrated rewards system</p>
            </div>
            
            {/* Trust Signals - Second Element */}
            <div className="glowing-card p-4 mb-10 max-w-4xl mx-auto">
              <h3 className="text-xl font-bold mb-3 rainbow-text text-center">Platform Statistics</h3>
              <div className="flex flex-wrap justify-center gap-6 mb-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div 
                      className="stats-circle-vibrant w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2" 
                      style={{ 
                        "--percentage": stat.label === "Active Users" ? "85%" : 
                                        stat.label === "Global Reach" ? "90%" : "95%"
                      } as React.CSSProperties}
                    >
                      <div className="absolute inset-2 rounded-full bg-gray-900 flex items-center justify-center">
                        <stat.icon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <h3 className="text-white font-bold stats-value text-lg live-counter">{stat.value}</h3>
                    <p className="text-purple-300 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Register Form */}
              <div className="md:order-2">
                <div className="max-w-md mx-auto">
                  <Register />
                </div>
              </div>
              
              {/* Hero Content */}
              <div className="md:order-1 space-y-6">
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                    <span className="neon-text">Join Our Platform</span>
                  </h2>
                  <p className="text-lg text-purple-300 mb-6">Create your account and get instant access to premium virtual numbers with our reward program.</p>
                </div>
                
                {/* Benefits */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="vibrant-card p-4 floating" style={{ animationDelay: `${index * 0.2}s` }}>
                      <div className="flex gap-3 items-start">
                        <div className="bg-gradient-to-br from-purple-600 to-indigo-800 p-2 rounded-lg">
                          <benefit.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white mb-1">{benefit.title}</h3>
                          <p className="text-gray-300 text-sm">{benefit.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Feature Badges */}
                <div className="flex flex-wrap gap-3 mt-4">
                  <span className="bg-purple-900/30 text-purple-300 text-xs font-medium px-3 py-1 rounded-full border border-purple-500/30 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> Privacy Protected
                  </span>
                  <span className="bg-blue-900/30 text-blue-300 text-xs font-medium px-3 py-1 rounded-full border border-blue-500/30 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> Premium Quality
                  </span>
                  <span className="bg-indigo-900/30 text-indigo-300 text-xs font-medium px-3 py-1 rounded-full border border-indigo-500/30 flex items-center gap-1">
                    <Lock className="h-3 w-3" /> Encrypted Data
                  </span>
                  <span className="bg-fuchsia-900/30 text-fuchsia-300 text-xs font-medium px-3 py-1 rounded-full border border-fuchsia-500/30 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> Growing Fast
                  </span>
                </div>
                
                {/* WhatsApp Contact Gain Section */}
                <div className="mt-12 glowing-card p-6">
                  <h3 className="text-2xl font-bold mb-4 text-center">
                    <span className="neon-text">Premium WhatsApp Access</span>
                  </h3>
                  <div className="flex flex-col sm:flex-row items-center justify-center mb-6 text-center">
                    <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-500 mb-2 sm:mb-0 sm:mr-3" />
                    <div className="text-center">
                      <p className="text-lg sm:text-xl text-white mb-1">Gain Access to Over</p>
                      <p className="text-2xl sm:text-3xl font-bold vibrant-gradient-text live-counter" style={{ minWidth: '115px', display: 'inline-block' }}>1,200,000+</p>
                      <p className="text-lg sm:text-xl text-white">Active WhatsApp Users</p>
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
                    <p className="text-xs text-yellow-200/70 mt-2">Pay to: Opay Bank - 8121320468 - Keno Darlington Avwunudiogba</p>
                    <p className="text-xs text-yellow-200/70 mt-1">Admin verification required after payment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
