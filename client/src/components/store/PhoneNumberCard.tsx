import React from "react";
import { PhoneNumber } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { 
  Globe2, 
  ShoppingCart, 
  AlertTriangle, 
  MessageCircle,
  Phone, 
  Facebook, 
  Send,
  MessageSquare,
  Smartphone 
} from "lucide-react";

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

  const getServiceIcon = (service: string) => {
    switch (service) {
      case "WhatsApp":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="#25D366"
            className="mr-1"
          >
            <path 
              d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
            />
          </svg>
        );
      case "Telegram":
        return <Send size={20} className="text-[#0088cc] mr-1" />;
      case "Signal":
        return <MessageCircle size={20} className="text-[#3a76f0] mr-1" />;
      case "WeChat":
        return <MessageSquare size={20} className="text-[#09b83e] mr-1" />;
      case "Facebook":
        return <Facebook size={20} className="text-[#1877f2] mr-1" />;
      case "Viber":
        return <Phone size={20} className="text-[#7360f2] mr-1" />;
      case "Line":
        return <Smartphone size={20} className="text-[#06c755] mr-1" />;
      default:
        return <MessageCircle size={20} className="text-purple-400 mr-1" />;
    }
  };

  // Get service-specific gradient
  const getServiceGradient = (service: string) => {
    switch (service) {
      case "WhatsApp":
        return "from-green-600 to-green-800";
      case "Telegram":
        return "from-blue-500 to-blue-700";
      case "Signal":
        return "from-blue-600 to-indigo-800";
      case "WeChat":
        return "from-green-500 to-green-700";
      case "Facebook":
        return "from-blue-600 to-blue-800";
      case "Viber":
        return "from-purple-500 to-purple-800";
      case "Line":
        return "from-green-500 to-teal-700";
      default:
        return "from-purple-600 to-indigo-800";
    }
  };

  const serviceType = phoneNumber.service || "WhatsApp";
  
  return (
    <div className="vibrant-card p-5 relative overflow-hidden transition-all duration-300 hover:scale-102 hover:shadow-purple-500/10 hover:shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`bg-gradient-to-br ${getServiceGradient(serviceType)} p-2 rounded-lg text-white`}>
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
          {phoneNumber.isAvailable ? 
            (phoneNumber.stockCount && phoneNumber.stockCount > 1 ? 
              `${phoneNumber.stockCount} In Stock` : "In Stock") 
            : "Out of Stock"}
        </span>
      </div>
      
      <div className="text-sm text-purple-300 mb-4 mt-2 border-t border-purple-900/20 pt-2 flex items-center">
        {getServiceIcon(serviceType)}
        <span>{serviceType} verified number</span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold vibrant-gradient-text">₦{phoneNumber.price.toFixed(2)}</div>
        <Button
          size="sm"
          variant={phoneNumber.isAvailable && !disabled ? "default" : "secondary"}
          disabled={!phoneNumber.isAvailable || disabled}
          onClick={() => onBuy(phoneNumber)}
          className={phoneNumber.isAvailable && !disabled 
            ? `bg-gradient-to-r ${getServiceGradient(serviceType)} hover:brightness-110 text-white` 
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
