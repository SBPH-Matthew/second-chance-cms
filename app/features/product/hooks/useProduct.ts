import {
    createProduct,
    deleteProduct,
    getProductDetails,
    paginateMyProducts,
    paginateProducts,
    PaginateProductsParams,
    updateProduct,
} from "@/app/services";
import {
    CreateProductRequest,
    ResponseType,
    ValidationResponse,
    Product,
} from "@/app/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export type HookPaginateProducts = Omit<PaginateProductsParams, "signal">;

export const usePaginateProducts = ({ page, limit, search }: HookPaginateProducts) => {
    const { data, isPending, error } = useQuery({
        queryKey: ["paginate-products", page, limit, search],
        queryFn: ({ signal }) => paginateProducts({ page, limit, search, signal }),
    });

    return { data, isPending, error };
};

export const usePaginateMyProducts = ({
    page,
    limit,
}: HookPaginateProducts) => {
    const { data, isPending, error } = useQuery({
        queryKey: ["paginate-my-products", page, limit],
        queryFn: ({ signal }) => paginateMyProducts({ page, limit, signal }),
    });

    return { data, isPending, error };
};

export const useCreateProduct = () => {
    return useMutation<
        ResponseType,
        ValidationResponse,
        CreateProductRequest
    >({
        mutationKey: ["create-product"],
        mutationFn: createProduct,
    });
};

export const useUpdateProduct = () => {
    return useMutation<
        ResponseType,
        ValidationResponse,
        { id: number; payload: CreateProductRequest }
    >({
        mutationKey: ["update-product"],
        mutationFn: updateProduct,
    });
};

export const useDeleteProduct = () => {
    return useMutation<ResponseType, unknown, number>({
        mutationKey: ["delete-product"],
        mutationFn: deleteProduct,
    });
};

export const useProductDetails = (id: number | null) => {
    const { data, isPending, error } = useQuery<{ message: string; product: Product }>({
        queryKey: ["product-details", id],
        queryFn: () => getProductDetails(id!),
        enabled: !!id,
    });

    return { data, isPending, error };
};
