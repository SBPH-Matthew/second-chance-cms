import {
  createBoost,
  getUserBoosts,
  getBoost,
  updateBoost,
  cancelBoost,
  getBoostPricing,
} from "@/app/services";
import {
  Boost,
  CreateBoostRequest,
  UpdateBoostRequest,
  BoostPricing,
} from "@/app/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetBoostPricing = () => {
  return useQuery<BoostPricing>({
    queryKey: ["boost-pricing"],
    queryFn: getBoostPricing,
  });
};

export const useCreateBoost = () => {
  const queryClient = useQueryClient();
  return useMutation<Boost, Error, CreateBoostRequest>({
    mutationFn: createBoost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-boosts"] });
      queryClient.invalidateQueries({ queryKey: ["paginate-products"] });
      queryClient.invalidateQueries({ queryKey: ["paginate-vehicles"] });
    },
  });
};

export const useGetUserBoosts = () => {
  return useQuery<Boost[]>({
    queryKey: ["user-boosts"],
    queryFn: getUserBoosts,
  });
};

export const useGetBoost = (id: number) => {
  return useQuery<Boost>({
    queryKey: ["boost", id],
    queryFn: () => getBoost(id),
    enabled: !!id,
  });
};

export const useUpdateBoost = () => {
  const queryClient = useQueryClient();
  return useMutation<Boost, Error, { id: number; data: UpdateBoostRequest }>({
    mutationFn: ({ id, data }) => updateBoost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-boosts"] });
      queryClient.invalidateQueries({ queryKey: ["paginate-products"] });
      queryClient.invalidateQueries({ queryKey: ["paginate-vehicles"] });
    },
  });
};

export const useCancelBoost = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: cancelBoost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-boosts"] });
      queryClient.invalidateQueries({ queryKey: ["paginate-products"] });
      queryClient.invalidateQueries({ queryKey: ["paginate-vehicles"] });
    },
  });
};