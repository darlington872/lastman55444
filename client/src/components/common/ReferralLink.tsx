import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check } from "lucide-react";

interface ReferralLinkProps {
  referralCode: string;
  className?: string;
}

const ReferralLink: React.FC<ReferralLinkProps> = ({ referralCode, className }) => {
  const { getReferralLink } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const referralLink = getReferralLink(referralCode);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard",
      });
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy referral link",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className={`bg-card ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg font-bold">Your Referral Link</CardTitle>
        <CardDescription>
          Share this link to invite friends and earn rewards
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Input
            value={referralLink}
            readOnly
            className="bg-background border-border"
          />
          <Button
            size="icon"
            variant="outline"
            onClick={copyToClipboard}
            className="flex-shrink-0 transition duration-200 ease-in-out"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralLink;