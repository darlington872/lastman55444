import { useQuery } from "@tanstack/react-query";
import { PhoneNumber } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";

export const usePhoneNumbers = () => {
  const { user } = useAuth();

  return useQuery<PhoneNumber[]>({
    queryKey: ["/api/phone-numbers"],
    enabled: !!user,
  });
};

export const useAdminPhoneNumbers = () => {
  const { user } = useAuth();

  return useQuery<PhoneNumber[]>({
    queryKey: ["/api/admin/phone-numbers"],
    enabled: !!user?.isAdmin,
  });
};
