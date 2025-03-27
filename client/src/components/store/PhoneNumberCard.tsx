import React from "react";
import { PhoneNumber } from "@shared/schema";
import { Button } from "@/components/ui/button";

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
    const lowerCountry = country.toLowerCase();
    
    if (lowerCountry.includes("united states") || lowerCountry === "usa" || lowerCountry === "us") {
      return "fas fa-globe-americas";
    } else if (lowerCountry.includes("united kingdom") || lowerCountry === "uk" || lowerCountry === "gb") {
      return "fas fa-globe-europe";
    } else if (lowerCountry.includes("canada") || lowerCountry === "ca") {
      return "fas fa-globe-americas";
    } else if (lowerCountry.includes("australia") || lowerCountry === "au") {
      return "fas fa-globe-asia";
    } else if (lowerCountry.includes("germany") || lowerCountry === "de") {
      return "fas fa-globe-europe";
    } else if (lowerCountry.includes("south africa") || lowerCountry === "za") {
      return "fas fa-globe-africa";
    }
    
    return "fas fa-globe";
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <i className={`${getCountryIcon(phoneNumber.country)} text-gray-500 mr-2`}></i>
          <span className="font-medium">{phoneNumber.country}</span>
        </div>
        <span
          className={`text-sm ${
            phoneNumber.isAvailable
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          } py-1 px-2 rounded-full`}
        >
          {phoneNumber.isAvailable ? "In Stock" : "Out of Stock"}
        </span>
      </div>
      <div className="text-sm text-gray-500 mb-3">WhatsApp verified number</div>
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold text-gray-800">${phoneNumber.price.toFixed(2)}</div>
        <Button
          size="sm"
          disabled={!phoneNumber.isAvailable || disabled}
          onClick={() => onBuy(phoneNumber)}
          className={!phoneNumber.isAvailable || disabled ? "bg-gray-300 text-gray-500 cursor-not-allowed" : ""}
        >
          {phoneNumber.isAvailable ? "Buy Now" : "Out of Stock"}
        </Button>
      </div>
    </div>
  );
};

export default PhoneNumberCard;
