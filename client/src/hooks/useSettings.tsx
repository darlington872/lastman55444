import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface SystemSettings {
  REFERRALS_NEEDED: string;
  ADMIN_CODE: string;
  KYC_REQUIRED_FOR_REFERRAL: string;
  LOCAL_PAYMENT_ACCOUNT: string;
  OPAY_ENABLED: string;
  KENO_ENABLED: string;
  SITE_NAME: string;
  SITE_DESCRIPTION: string;
  CONTACT_EMAIL: string;
  MAINTENANCE_MODE: string;
}

export const useSettings = () => {
  const { user } = useAuth();

  return useQuery<SystemSettings>({
    queryKey: ["/api/admin/settings"],
    select: (data) => {
      const settings = data as any[];
      const result: Partial<SystemSettings> = {};
      
      settings.forEach(setting => {
        if (setting.key && setting.value) {
          result[setting.key as keyof SystemSettings] = setting.value;
        }
      });
      
      return result as SystemSettings;
    },
    enabled: !!user?.isAdmin,
  });
};

export const useUpdateSettings = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (settings: Partial<SystemSettings>) => {
      const response = await apiRequest("PATCH", "/api/admin/settings", settings);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Settings Updated",
        description: "System settings have been updated successfully.",
      });
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
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
