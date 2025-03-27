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
  Smartphone
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

  // Fake platform benefits
  const benefits = [
    { title: "Premium Numbers", description: "Access to exclusive WhatsApp numbers from 90+ countries", icon: Smartphone },
    { title: "Instant Activation", description: "Numbers are delivered and activated within minutes", icon: Zap },
    { title: "Earn With Referrals", description: "Get ₦100 for each user you refer to our platform", icon: CircleDollarSign },
    { title: "24/7 Support", description: "Get help anytime with our ETHERVOX AI assistant", icon: Headphones },
  ];

  return (
    <div className="min-h-screen flex font-sans antialiased">
      <Sidebar isOpen={false} onClose={() => {}} />
      
      <div className="flex-1 overflow-hidden bg-black">
        <div className="overflow-auto h-screen">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Register Form */}
              <div className="md:order-2">
                <div className="max-w-md mx-auto">
                  <Register />
                </div>
              </div>
              
              {/* Hero Content */}
              <div className="md:order-1 space-y-6">
                <div>
                  <h1 className="text-4xl lg:text-5xl font-extrabold mb-4">
                    <span className="neon-text">Join ETHERDOXSHEFZYSMS</span>
                  </h1>
                  <p className="text-xl text-purple-300 mb-8">Create your account and get instant access to premium virtual numbers with our reward program.</p>
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
                
                {/* Trust Signals */}
                <div className="glowing-card p-5 mt-6">
                  <h3 className="text-xl font-bold mb-4 rainbow-text text-center">Why Users Trust Us</h3>
                  
                  <div className="flex flex-wrap justify-center gap-6 mb-4">
                    <div className="text-center">
                      <div className="stats-circle w-20 h-20 mx-auto mb-2" style={{ "--percentage": "98%" } as React.CSSProperties}>
                        <div className="absolute inset-[3px] rounded-full bg-gray-900 flex items-center justify-center">
                          <p className="text-lg font-bold text-white">98%</p>
                        </div>
                      </div>
                      <p className="text-purple-300 text-sm">Success Rate</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="stats-circle w-20 h-20 mx-auto mb-2" style={{ "--percentage": "100%" } as React.CSSProperties}>
                        <div className="absolute inset-[3px] rounded-full bg-gray-900 flex items-center justify-center">
                          <p className="text-lg font-bold text-white">100%</p>
                        </div>
                      </div>
                      <p className="text-purple-300 text-sm">Secure</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="stats-circle w-20 h-20 mx-auto mb-2" style={{ "--percentage": "90%" } as React.CSSProperties}>
                        <div className="absolute inset-[3px] rounded-full bg-gray-900 flex items-center justify-center">
                          <p className="text-lg font-bold text-white">24/7</p>
                        </div>
                      </div>
                      <p className="text-purple-300 text-sm">Support</p>
                    </div>
                  </div>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
