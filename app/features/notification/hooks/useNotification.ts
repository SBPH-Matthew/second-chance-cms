import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/app/services/api/notification.service";
import { ResponseType, ValidationResponse } from "@/app/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetNotifications = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["notifications"],
    queryFn: ({ signal }) => getNotifications(signal),
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });

  return { data, isPending, error };
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ResponseType,
    ValidationResponse,
    number
  >({
    mutationKey: ["mark-notification-read"],
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, ValidationResponse>({
    mutationKey: ["mark-all-notifications-read"],
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
