import React from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useUserProfile } from "@/hooks/useUser";
import { useReferrals, useReferralSettings, useClaimReferralReward } from "@/hooks/useReferrals";
import { usePhoneNumbers } from "@/hooks/usePhoneNumbers";
import ReferralCard from "@/components/referral/ReferralCard";
import ReferralProgress from "@/components/dashboard/ReferralProgress";
import ReferralTable from "@/components/referral/ReferralTable";
import { useToast } from "@/hooks/use-toast";

const ReferralsPage: React.FC = () => {
  const { toast } = useToast();
  const { data: user, isLoading: isUserLoading } = useUserProfile();
  const { data: referrals, isLoading: isReferralsLoading } = useReferrals();
  const { data: phoneNumbers, isLoading: isPhoneNumbersLoading } = usePhoneNumbers();
  const { data: settings } = useReferralSettings();
  const { mutate: claimReward, isPending } = useClaimReferralReward();

  // Generate a referral link
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const referralLink = user ? `${baseUrl}/register?ref=${user.referralCode}` : "";

  // Get required referrals from settings or use default
  const requiredReferrals = settings?.REFERRALS_NEEDED ? parseInt(settings.REFERRALS_NEEDED) : 20;
  
  // Determine if user can claim a reward
  const canClaim = user && user.referralCount >= requiredReferrals && phoneNumbers && phoneNumbers.length > 0;

  const handleClaimReward = () => {
    if (!canClaim) {
      toast({
        title: "Cannot claim reward",
        description: phoneNumbers && phoneNumbers.length === 0 
          ? "There are no available phone numbers in stock. Please try again later."
          : `You need ${requiredReferrals} referrals to claim a free number. You currently have ${user?.referralCount || 0}.`,
        variant: "destructive",
      });
      return;
    }

    // Get the first available phone number
    const availableNumber = phoneNumbers.find(pn => pn.isAvailable);
    
    if (!availableNumber) {
      toast({
        title: "No numbers available",
        description: "There are no available phone numbers in stock. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    claimReward(availableNumber.id);
  };

  return (
    <DashboardLayout title="My Referrals">
      {/* Referral Link Card */}
      <ReferralCard referralLink={referralLink} />
      
      {/* Progress Card */}
      <ReferralProgress
        referralCount={user?.referralCount || 0}
        requiredReferrals={requiredReferrals}
        onClaimReward={handleClaimReward}
        isLoading={isPending}
        canClaim={!!canClaim}
      />
      
      {/* Referrals Table */}
      <ReferralTable
        referrals={referrals || []}
        isLoading={isReferralsLoading}
      />
    </DashboardLayout>
  );
};

export default ReferralsPage;
