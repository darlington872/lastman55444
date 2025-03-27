import { useQuery, useMutation } from "@tanstack/react-query";
import { Order, PhoneNumber } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export const useOrders = () => {
  const { user } = useAuth();

  return useQuery<Order[]>({
    queryKey: ["/api/orders"],
    enabled: !!user,
  });
};

export const useOrdersWithPhoneNumbers = () => {
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { data: phoneNumbers, isLoading: phoneNumbersLoading } = usePhoneNumbers();

  const ordersWithPhoneNumbers = orders?.map(order => {
    const phoneNumber = phoneNumbers?.find(pn => pn.id === order.phoneNumberId);
    return { ...order, phoneNumber };
  });

  return {
    data: ordersWithPhoneNumbers || [],
    isLoading: ordersLoading || phoneNumbersLoading
  };
};

export const usePhoneNumbers = () => {
  const { user } = useAuth();

  return useQuery<PhoneNumber[]>({
    queryKey: ["/api/phone-numbers"],
    enabled: !!user,
  });
};

export const usePurchasePhoneNumber = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ phoneNumberId, paymentMethod }: { phoneNumberId: number; paymentMethod: string }) => {
      const response = await apiRequest("POST", "/api/orders", {
        userId: user?.id,
        phoneNumberId,
        paymentMethod,
        totalAmount: 0, // This will be calculated on server
        isReferralReward: false
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Purchase Successful",
        description: "You have successfully purchased a WhatsApp number.",
      });
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/phone-numbers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/activities"] });
    },
    onError: (error) => {
      toast({
        title: "Purchase Failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    },
  });
};

export const useAdminOrders = () => {
  const { user } = useAuth();

  return useQuery<Order[]>({
    queryKey: ["/api/admin/orders"],
    enabled: !!user?.isAdmin,
  });
};

export const useUpdateOrder = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ orderId, status, code }: { orderId: number; status: string; code?: string }) => {
      const response = await apiRequest("PATCH", `/api/admin/orders/${orderId}`, { 
        status, 
        code 
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Order Updated",
        description: "Order has been updated successfully.",
      });
      // Invalidate queries to refresh data
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
