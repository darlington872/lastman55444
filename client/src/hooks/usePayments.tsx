import { useQuery, useMutation } from "@tanstack/react-query";
import { Payment } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export const usePayments = () => {
  const { user } = useAuth();

  return useQuery<Payment[]>({
    queryKey: ["/api/payments"],
    enabled: !!user,
  });
};

export const useCreatePayment = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ amount, method, orderId, reference }: { amount: number; method: string; orderId?: number; reference?: string }) => {
      const response = await apiRequest("POST", "/api/payments", {
        userId: user?.id,
        amount,
        method,
        orderId,
        reference
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Payment Submitted",
        description: "Your payment has been submitted for processing.",
      });
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/payments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/activities"] });
    },
    onError: (error) => {
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    },
  });
};

export const useAdminPayments = (pendingOnly: boolean = false) => {
  const { user } = useAuth();

  return useQuery<Payment[]>({
    queryKey: ["/api/admin/payments", { pending: pendingOnly }],
    enabled: !!user?.isAdmin,
  });
};

export const useUpdatePayment = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ paymentId, status }: { paymentId: number; status: string }) => {
      const response = await apiRequest("PATCH", `/api/admin/payments/${paymentId}`, { status });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Payment Updated",
        description: "Payment status has been updated successfully.",
      });
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/admin/payments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
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
