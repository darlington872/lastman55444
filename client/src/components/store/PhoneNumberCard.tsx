import React from "react";
import { PhoneNumber } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Globe, Globe2, ShoppingCart, AlertTriangle } from "lucide-react";

interface PhoneNumberCardProps {
  phoneNumber: PhoneNumber;
  onBuy: (phoneNumber: PhoneNumber) => void;
  disabled?: boolean;
}

const PhoneNumberCard: React.FC<PhoneNumberCardProps> = ({
  phoneNumber,
  onBuy,
  disabled = false,
}) => {
  const getCountryIcon = (country: string) => {
    return <Globe2 className="h-5 w-5" />;
  };

  return (
    <div className="vibrant-card p-5 relative overflow-hidden transition-all duration-300 hover:scale-102 hover:shadow-purple-500/10 hover:shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-800 p-2 rounded-lg text-white">
            {getCountryIcon(phoneNumber.country)}
          </div>
          <span className="font-medium text-white">{phoneNumber.country}</span>
        </div>
        <span
          className={`text-xs font-bold ${
            phoneNumber.isAvailable
              ? "bg-gradient-to-r from-green-500/80 to-emerald-600/80 text-white"
              : "bg-gradient-to-r from-red-500/80 to-pink-600/80 text-white"
          } py-1 px-3 rounded-full`}
        >
          {phoneNumber.isAvailable ? "In Stock" : "Out of Stock"}
        </span>
      </div>
      
      <div className="text-sm text-purple-300 mb-4 mt-2 border-t border-purple-900/20 pt-2">
        WhatsApp verified number
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold vibrant-gradient-text">₦{phoneNumber.price.toFixed(2)}</div>
        <Button
          size="sm"
          variant={phoneNumber.isAvailable && !disabled ? "default" : "secondary"}
          disabled={!phoneNumber.isAvailable || disabled}
          onClick={() => onBuy(phoneNumber)}
          className={phoneNumber.isAvailable && !disabled 
            ? "bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white" 
            : "bg-gray-800 text-gray-400 cursor-not-allowed"
          }
        >
          {phoneNumber.isAvailable ? (
            <div className="flex items-center gap-1">
              <ShoppingCart className="h-4 w-4 mr-1" />
              Buy Now
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Out of Stock
            </div>
          )}
        </Button>
      </div>
      
      {/* Decorative element */}
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-purple-500/10 rounded-full blur-xl"></div>
      <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-indigo-500/10 rounded-full blur-lg"></div>
    </div>
  );
};

export default PhoneNumberCard;
