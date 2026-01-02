import { getRoles } from "@/app/services";
import { useQuery } from "@tanstack/react-query";

export const useGetRoles = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["roles"],
    queryFn: ({ signal }) => getRoles(signal),
  });

  return { data, isPending, error };
};
