import React from "react";
import { Button } from "@/components/ui/button";
import { useReferrals } from "@/hooks/useReferrals";

interface ReferralProgressProps {
  referralCount: number;
  requiredReferrals: number;
  onClaimReward: () => void;
  isLoading: boolean;
  canClaim: boolean;
}

const ReferralProgress: React.FC<ReferralProgressProps> = ({
  referralCount,
  requiredReferrals,
  onClaimReward,
  isLoading,
  canClaim
}) => {
  const progress = Math.min(100, (referralCount / requiredReferrals) * 100);
  const remainingReferrals = Math.max(0, requiredReferrals - referralCount);

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-6">
        <div className="flex justify-between mb-2">
          <h2 className="text-lg font-medium text-gray-800">Progress</h2>
          <span className="text-sm text-gray-500">
            <span>{referralCount}</span>/{requiredReferrals} Referrals
          </span>
        </div>
        <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-sm text-gray-600">
              {remainingReferrals > 0 ? (
                <>
                  Need <strong>{remainingReferrals}</strong> more referrals to claim a free WhatsApp number
                </>
              ) : (
                <>
                  You can claim a free WhatsApp number!
                </>
              )}
            </p>
          </div>
          <Button
            disabled={!canClaim || isLoading}
            onClick={onClaimReward}
            variant={canClaim ? "default" : "secondary"}
            className={!canClaim ? "opacity-50" : ""}
          >
            {isLoading ? "Processing..." : "Claim Free Number"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReferralProgress;
