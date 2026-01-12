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
    CreateProductResponse,
    ProductDetailsResponse,
    ResponseType,
    ValidationResponse,
} from "@/app/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export type HookPaginateProducts = Omit<PaginateProductsParams, "signal">;

export const usePaginateProducts = ({ page, limit }: HookPaginateProducts) => {
    const { data, isPending, error } = useQuery({
        queryKey: ["paginate-products", page, limit],
        queryFn: ({ signal }) => paginateProducts({ page, limit, signal }),
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
        CreateProductResponse,
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
    const { data, isPending, error } = useQuery<ProductDetailsResponse>({
        queryKey: ["product-details", id],
        queryFn: () => getProductDetails(id!),
        enabled: !!id,
    });

    return { data, isPending, error };
};
