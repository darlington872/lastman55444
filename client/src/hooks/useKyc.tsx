import { useQuery, useMutation } from "@tanstack/react-query";
import { Kyc } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export const useKyc = () => {
  const { user } = useAuth();

  return useQuery<Kyc>({
    queryKey: ["/api/kyc"],
    enabled: !!user,
  });
};

export const useSubmitKyc = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (kycData: {
      fullName: string;
      address: string;
      city: string;
      postalCode: string;
      country: string;
      idType: string;
      idFront: string;
      idBack: string;
      selfie: string;
    }) => {
      const response = await apiRequest("POST", "/api/kyc", {
        ...kycData,
        userId: user?.id,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "KYC Submitted",
        description: "Your KYC documents have been submitted for verification.",
      });
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/kyc"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/activities"] });
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    },
  });
};

export const useAdminKyc = (pendingOnly: boolean = false) => {
  const { user } = useAuth();

  return useQuery<Kyc[]>({
    queryKey: ["/api/admin/kyc", { pending: pendingOnly }],
    enabled: !!user?.isAdmin,
  });
};

export const useUpdateKyc = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ kycId, status }: { kycId: number; status: string }) => {
      const response = await apiRequest("PATCH", `/api/admin/kyc/${kycId}`, { status });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "KYC Updated",
        description: "KYC status has been updated successfully.",
      });
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/admin/kyc"] });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    },
  });
};
