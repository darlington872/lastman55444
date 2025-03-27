import { useQuery, useMutation } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export const useReferrals = () => {
  const { user } = useAuth();

  return useQuery<User[]>({
    queryKey: ["/api/user/referrals"],
    enabled: !!user,
  });
};

export const useReferralSettings = () => {
  const { user } = useAuth();

  return useQuery<{ REFERRALS_NEEDED: string; KYC_REQUIRED_FOR_REFERRAL: string }>({
    queryKey: ["/api/admin/settings"],
    select: (data) => {
      const settings = data as any[];
      const referralsNeeded = settings.find(s => s.key === "REFERRALS_NEEDED")?.value || "20";
      const kycRequired = settings.find(s => s.key === "KYC_REQUIRED_FOR_REFERRAL")?.value || "true";
      
      return {
        REFERRALS_NEEDED: referralsNeeded,
        KYC_REQUIRED_FOR_REFERRAL: kycRequired
      };
    },
    enabled: !!user?.isAdmin, // Only admins can fetch all settings, we'll use defaults for other users
  });
};

export const useClaimReferralReward = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (phoneNumberId: number) => {
      const response = await apiRequest("POST", "/api/orders", {
        userId: user?.id,
        phoneNumberId,
        paymentMethod: "referral",
        totalAmount: 0,
        isReferralReward: true
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Reward Claimed!",
        description: "You have successfully claimed your free WhatsApp number.",
      });
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/activities"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to claim reward",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    },
  });
};
