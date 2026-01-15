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
  CreateProductRequest,
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
import { useGetAllCategories } from "@/app/features/category/hooks";

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
  const handleAdd = (data: CreateProductRequest) => {
    createProduct(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["paginate-products"],
        });
        setTimeout(() => {
          setIsAddOpen(false);
          resetCreate();
        }, 500);
      },
      onError: () => {
        setTimeout(() => {
          resetCreate();
        }, 2000);
      },
    });
  };

  const handleEdit = (data: CreateProductRequest) => {
    if (!currentProduct) return;

    updateProduct(
      {
        id: currentProduct.id,
        payload: data,
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
        onError: () => {
          setTimeout(() => {
            resetUpdate();
          }, 2000);
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
    conditionsData?.product_conditions?.map((c) => ({
      ID: c.id,
      Name: c.name,
    })) || [];

  const statuses: ProductStatus[] =
    statusesData?.product_status?.map((s) => ({
      ID: s.id,
      Name: s.name,
    })) || [];

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
                <Button renderIcon={Add} onClick={() => setIsAddOpen(true)}>
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

                  const categoryName =
                    (rowData.category?.Name && rowData.category.Name.trim()) || "N/A";

                  const conditionName =
                    (rowData.condition?.Name && rowData.condition.Name.trim()) || "Unknown";

                  const statusName =
                    (rowData.status?.Name && rowData.status.Name.trim()) || "Unknown";

                  const statusType =
                    statusName === "ACTIVE"
                      ? "cyan"
                      : statusName === "SOLD"
                        ? "red"
                        : "gray";

                  const getImageUrl = (imagePath: string) => {
                    if (imagePath.startsWith('http')) {
                      return imagePath;
                    }
                    const apiUrl = process.env.NEXT_PUBLIC_API || '';
                    return `${apiUrl}${imagePath}`;
                  };

                  return (
                    <TableRow {...getRowProps({ row })} key={row.id}>
                      <TableCell>
                        <div className="flex gap-3">
                          {rowData.images && rowData.images.length > 0 && (
                            <div className="flex-shrink-0">
                              <img
                                src={getImageUrl(rowData.images[0])}
                                alt={rowData.name}
                                className="w-16 h-16 object-cover rounded border"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <strong>{rowData.name}</strong>
                            {rowData.description && (
                              <div
                                className="text-xs text-gray-500 truncate max-w-xs"
                                title={rowData.description}
                              >
                          {rowData.description}
                              </div>
                            )}
                            {rowData.images && rowData.images.length > 1 && (
                              <div className="text-xs text-gray-400">
                                +{rowData.images.length - 1} more image{rowData.images.length - 1 > 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>${rowData.price.toFixed(2)}</TableCell>
                      <TableCell>{categoryName}</TableCell>
                      <TableCell>
                        <Tag type="blue">{conditionName}</Tag>
                      </TableCell>
                      <TableCell>
                        <Tag type={statusType}>{statusName}</Tag>
                      </TableCell>
                      <TableCell className="sticky right-0 bg-layer">
                        <OverflowMenu flipped>
                          <OverflowMenuItem
                            itemText="Edit"
                            onClick={() => openEdit(rowData)}
                          />
                          <OverflowMenuItem
                            itemText="Delete"
                            isDelete
                            onClick={() => openDelete(rowData)}
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
        onClose={() => {
          setIsAddOpen(false);
          resetCreate();
        }}
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
            resetUpdate();
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
          productId={currentProduct.id}
          productName={currentProduct.name}
          onClose={() => {
            setIsDeleteOpen(false);
            setCurrentProduct(null);
            resetDelete();
          }}
        />
      )}
    </div>
  );
};
