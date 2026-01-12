import { getProductConditions } from "@/app/services";
import { useQuery } from "@tanstack/react-query";

export const useGetProductConditions = () => {
    const { data, isPending, error } = useQuery({
        queryKey: ["product-conditions"],
        queryFn: ({ signal }) => getProductConditions(signal),
    });

    return { data, isPending, error };
};
