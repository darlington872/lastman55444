import { useQuery, useMutation } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

export const useUserProfile = () => {
  const { user: authUser } = useAuth();

  return useQuery<User>({
    queryKey: ["/api/user/profile"],
    enabled: !!authUser,
  });
};

export const useAddFunds = () => {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ amount, method, reference }: { amount: number; method: string; reference?: string }) => {
      const response = await apiRequest("POST", "/api/payments", {
        userId: user?.id,
        amount,
        method,
        reference
      });
      return response.json();
    },
    onSuccess: () => {
      // Invalidate user profile to update balance
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
    },
  });
};

export const useUserActivities = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["/api/user/activities"],
    enabled: !!user,
  });
};
