"use client";

import {
    Button,
    DataTable,
    DataTableSkeleton,
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableHeader,
    TableRow,
    TableToolbar,
    TableToolbarContent,
    TableToolbarSearch,
    Tag,
    OverflowMenu,
    OverflowMenuItem,
} from "@carbon/react";
import { Add } from "@carbon/icons-react";
import { useState } from "react";
import {
    Product as ProductType,
    ProductCategory,
    ProductCondition,
    ProductStatus,
} from "@/app/types/product";
import { ProductFormModal } from "./components/ProductFormModal";
import { DeleteProductModal } from "./components/DeleteProductModal";
import {
    useCreateProduct,
    useDeleteProduct,
    useGetProductConditions,
    useGetProductStatuses,
    usePaginateProducts,
    useUpdateProduct,
} from "./hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useModalLoading } from "@/app/hooks";
import {
    useGetAllCategories,
    useGetCategoryGroups,
    useGetCategoryStatuses,
} from "@/app/features/category/hooks";

const TABLE_HEADERS = [
    { key: "name", header: "Name" },
    { key: "price", header: "Price" },
    { key: "category", header: "Category" },
    { key: "condition", header: "Condition" },
    { key: "status", header: "Status" },
    { key: "actions", header: "" },
];

export const Product = () => {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<ProductType | null>(
        null,
    );

    // Data Fetching
    const { data: productsData, isPending: isLoadingProducts } =
        usePaginateProducts({
            page,
            limit: pageSize,
        });

    const { data: categoriesData } = useGetAllCategories();

    const { data: conditionsData } = useGetProductConditions();
    const { data: statusesData } = useGetProductStatuses();

    // Mutations
    const {
        mutateAsync: createProduct,
        isPending: isCreating,
        isSuccess: isCreateSuccess,
        isError: isCreateError,
        reset: resetCreate,
    } = useCreateProduct();

    const {
        mutateAsync: updateProduct,
        isPending: isUpdating,
        isSuccess: isUpdateSuccess,
        isError: isUpdateError,
        reset: resetUpdate,
    } = useUpdateProduct();

    const {
        mutateAsync: deleteProduct,
        isPending: isDeleting,
        isSuccess: isDeleteSuccess,
        isError: isDeleteError,
        reset: resetDelete,
    } = useDeleteProduct();

    // Loading States
    const { status: createUpdateStatus } = useModalLoading({
        loading: isCreating || isUpdating,
        success: isCreateSuccess || isUpdateSuccess,
        error: isCreateError || isUpdateError,
    });

    const { status: deleteStatus } = useModalLoading({
        loading: isDeleting,
        success: isDeleteSuccess,
        error: isDeleteError,
    });

    // Handlers
    const handleAdd = (data: Partial<ProductType>) => {
        // Map partial product data to request format
        createProduct(
            {
                name: data.name!,
                description: data.description!,
                price: data.price!,
                category_id: data.categoryId!,
                product_condition_id: data.productConditionId!,
                status_id: data.statusId!,
            },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: ["paginate-products"],
                    });
                    setTimeout(() => {
                        setIsAddOpen(false);
                        resetCreate();
                    }, 500);
                },
            },
        );
    };

    const handleEdit = (data: Partial<ProductType>) => {
        if (!currentProduct) return;

        updateProduct(
            {
                id: currentProduct.id,
                payload: {
                    name: data.name!,
                    description: data.description!,
                    price: data.price!,
                    category_id: data.categoryId!,
                    product_condition_id: data.productConditionId!,
                    status_id: data.statusId!,
                },
            },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: ["paginate-products"],
                    });
                    setTimeout(() => {
                        setIsEditOpen(false);
                        setCurrentProduct(null);
                        resetUpdate();
                    }, 500);
                },
            },
        );
    };

    const handleDelete = () => {
        if (!currentProduct) return;
        deleteProduct(currentProduct.id, {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["paginate-products"],
                });
                setTimeout(() => {
                    setIsDeleteOpen(false);
                    setCurrentProduct(null);
                    resetDelete();
                }, 500);
            },
        });
    };

    const openEdit = (product: ProductType) => {
        setCurrentProduct(product);
        setIsEditOpen(true);
    };

    const openDelete = (product: ProductType) => {
        setCurrentProduct(product);
        setIsDeleteOpen(true);
    };

    // Prepare data for Table
    const rows = productsData?.products.items || [];
    const totalItems = productsData?.products.total || 0;

    // Prepare dropdown data
    const categories: ProductCategory[] =
        categoriesData?.categories?.map((c) => ({
            id: c.id,
            name: c.name,
        })) || [];

    const conditions: ProductCondition[] =
        conditionsData?.product_conditions || [];

    const statuses: ProductStatus[] = statusesData?.product_status || [];

    if (isLoadingProducts) {
        return (
            <DataTableSkeleton
                headers={TABLE_HEADERS}
                columnCount={TABLE_HEADERS.length}
                showToolbar
                showHeader
            />
        );
    }

    return (
        <div className="h-full w-full bg-background">
            <DataTable
                rows={rows.map((r) => ({ ...r, id: r.id?.toString() }))}
                headers={TABLE_HEADERS}
            >
                {({
                    rows: tableRows,
                    headers,
                    getHeaderProps,
                    getRowProps,
                    getTableProps,
                }) => (
                    <TableContainer
                        className="p-0!"
                        title="Products"
                        description="Manage your product inventory"
                    >
                        <TableToolbar>
                            <TableToolbarContent>
                                <TableToolbarSearch />
                                <Button
                                    renderIcon={Add}
                                    onClick={() => setIsAddOpen(true)}
                                >
                                    Add Product
                                </Button>
                            </TableToolbarContent>
                        </TableToolbar>
                        <Table {...getTableProps()}>
                            <TableHead>
                                <TableRow>
                                    {headers.map((header) => (
                                        <TableHeader
                                            {...getHeaderProps({ header })}
                                            key={header.key}
                                        >
                                            {header.header}
                                        </TableHeader>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tableRows.map((row) => {
                                    const rowData = rows.find(
                                        (r) => r.id.toString() === row.id,
                                    );

                                    if (!rowData) return null;

                                    return (
                                        <TableRow
                                            {...getRowProps({ row })}
                                            key={row.id}
                                        >
                                            <TableCell>
                                                <strong>{rowData.name}</strong>
                                                <div className="text-xs text-gray-500">
                                                    {rowData.description}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                ${rowData.price}
                                            </TableCell>
                                            <TableCell>
                                                {rowData.category === "string"
                                                    ? rowData.category
                                                    : "N/A"}
                                            </TableCell>
                                            <TableCell>
                                                <Tag
                                                    type={
                                                        rowData.productConditionId ===
                                                        1
                                                            ? "green"
                                                            : "blue"
                                                    }
                                                >
                                                    {rowData.condition ||
                                                        rowData.productCondition
                                                            ?.name ||
                                                        "Unknown"}
                                                </Tag>
                                            </TableCell>
                                            <TableCell>
                                                <Tag
                                                    type={
                                                        rowData.status ===
                                                            "ACTIVE" ||
                                                        (typeof rowData.status ===
                                                            "object" &&
                                                            rowData.status
                                                                ?.name ===
                                                                "ACTIVE")
                                                            ? "cyan"
                                                            : rowData.status ===
                                                                    "SOLD" ||
                                                                (typeof rowData.status ===
                                                                    "object" &&
                                                                    rowData
                                                                        .status
                                                                        ?.name ===
                                                                        "SOLD")
                                                              ? "red"
                                                              : "gray"
                                                    }
                                                >
                                                    {(typeof rowData.status ===
                                                    "object"
                                                        ? rowData.status.name
                                                        : rowData.status) ||
                                                        "Unknown"}
                                                </Tag>
                                            </TableCell>
                                            <TableCell className="sticky right-0 bg-layer">
                                                <OverflowMenu flipped>
                                                    <OverflowMenuItem
                                                        itemText="Edit"
                                                        onClick={() =>
                                                            openEdit(rowData)
                                                        }
                                                    />
                                                    <OverflowMenuItem
                                                        itemText="Delete"
                                                        isDelete
                                                        onClick={() =>
                                                            openDelete(rowData)
                                                        }
                                                    />
                                                </OverflowMenu>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </DataTable>
            <Pagination
                backwardText="Previous page"
                forwardText="Next page"
                itemsPerPageText="Items per page:"
                page={page}
                pageSize={pageSize}
                pageSizes={[10, 20, 30, 40, 50]}
                totalItems={totalItems}
                onChange={({ page: p, pageSize: s }) => {
                    setPage(p);
                    setPageSize(s);
                }}
            />

            <ProductFormModal
                open={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onSubmit={handleAdd}
                categories={categories}
                conditions={conditions}
                statuses={statuses}
            />

            {currentProduct && (
                <ProductFormModal
                    open={isEditOpen}
                    initialData={currentProduct}
                    onClose={() => {
                        setIsEditOpen(false);
                        setCurrentProduct(null);
                    }}
                    onSubmit={handleEdit}
                    categories={categories}
                    conditions={conditions}
                    statuses={statuses}
                />
            )}

            {currentProduct && (
                <DeleteProductModal
                    open={isDeleteOpen}
                    productName={currentProduct.name}
                    onClose={() => {
                        setIsDeleteOpen(false);
                        setCurrentProduct(null);
                    }}
                    onConfirm={handleDelete}
                />
            )}
        </div>
    );
};
