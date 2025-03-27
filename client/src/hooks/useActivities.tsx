import { useQuery } from "@tanstack/react-query";
import { Activity } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";

export const useActivities = () => {
  const { user } = useAuth();

  return useQuery<Activity[]>({
    queryKey: ["/api/user/activities"],
    enabled: !!user,
  });
};
