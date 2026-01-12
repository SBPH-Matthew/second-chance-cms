import { getProductStatuses } from "@/app/services";
import { useQuery } from "@tanstack/react-query";

export const useGetProductStatuses = () => {
    const { data, isPending, error } = useQuery({
        queryKey: ["product-statuses"],
        queryFn: ({ signal }) => getProductStatuses(signal),
    });

    return { data, isPending, error };
};
