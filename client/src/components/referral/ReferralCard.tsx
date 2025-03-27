import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ReferralCardProps {
  referralLink: string;
}

const ReferralCard: React.FC<ReferralCardProps> = ({ referralLink }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Your Referral Link</h2>
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 border rounded-md overflow-hidden mb-3 md:mb-0 md:mr-3">
            <Input
              type="text"
              readOnly
              value={referralLink}
              className="w-full px-3 py-2 border-0 bg-gray-50"
            />
          </div>
          <Button onClick={copyToClipboard} className="flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
            {copied ? "Copied!" : "Copy Link"}
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-3">
          Share this link with friends to earn free WhatsApp numbers.
        </p>
      </div>
    </div>
  );
};

export default ReferralCard;
