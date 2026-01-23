import { getProfile } from "@/app/services";
import { ProfileResponse } from "@/app/services/api/profile.service";
import { useQuery } from "@tanstack/react-query";

export const useProfile = () => {
  const { data, isPending, error } = useQuery<ProfileResponse, Error>({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  return { data, isPending, error };
};
