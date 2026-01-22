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
  Popover,
  PopoverContent,
} from "@carbon/react";
import { Add, Information } from "@carbon/icons-react";
import { useState, useRef, useEffect } from "react";
import {
  CreateProductRequest,
  Product as ProductType,
  ProductCondition,
  ProductStatus,
} from "@/app/types/product";
import { Category } from "@/app/types";
import { ProductFormModal } from "./components/ProductFormModal";
import { DeleteProductModal } from "./components/DeleteProductModal";
import { BoostModal } from "./components/BoostModal";
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
import { useDebounce } from "@/app/hooks/useDebounce";

const TABLE_HEADERS = [
  { key: "name", header: "Name" },
  { key: "price", header: "Price" },
  { key: "category", header: "Category" },
  { key: "condition", header: "Condition" },
  { key: "status", header: "Status" },
  { key: "boost", header: "Boost" },
  { key: "actions", header: "" },
];

// Component for Boost Info Popover
const BoostInfoPopover = ({ boost }: { boost: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleOpen = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleClose = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!boost.start_date || !boost.end_date) return null;

  const startDate = new Date(boost.start_date);
  const endDate = new Date(boost.end_date);
  const now = new Date();

  // Calculate elapsed time
  const elapsedMs = now.getTime() - startDate.getTime();
  const elapsedHours = Math.floor(elapsedMs / (1000 * 60 * 60));
  const elapsedMinutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));

  // Calculate remaining time
  const remainingMs = endDate.getTime() - now.getTime();

  const isExpired = remainingMs <= 0;
  const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
  const remainingMinutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
  const remainingDays = Math.floor(remainingHours / 24);

  const elapsedText = elapsedHours > 0 
    ? `${elapsedHours}h ${elapsedMinutes}m elapsed`
    : `${elapsedMinutes}m elapsed`;

  const remainingText = remainingDays > 0
    ? `${remainingDays} day${remainingDays > 1 ? 's' : ''}, ${remainingHours % 24}h ${remainingMinutes}m`
    : remainingHours > 0
      ? `${remainingHours}h ${remainingMinutes}m`
      : `${remainingMinutes}m`;

  return (
    <Popover
      align="left"
      autoAlign
      dropShadow
      caret={false}
      open={isOpen}
      onRequestClose={() => setIsOpen(false)}
    >
      <button
        type="button"
        className="flex items-center justify-center w-4 h-4 text-icon-secondary hover:text-icon-primary transition-colors"
        aria-label="Boost information"
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
        onClick={handleClick}
      >
        <Information size={14} />
      </button>
      <PopoverContent 
        className="p-3!"
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
      >
        <div className="flex flex-col gap-2 min-w-[200px]">
          <div className="font-semibold text-sm">
            Boost Details
          </div>
          <div className="text-xs text-text-secondary space-y-1">
            {isExpired ? (
              <>
                <div>Status: <span className="font-medium text-red-600">Expired</span></div>
                <div>Ended: {endDate.toLocaleString()}</div>
              </>
            ) : (
              <>
                <div>
                  <span className="font-medium">Elapsed:</span> {elapsedText}
                </div>
                <div>
                  <span className="font-medium">Remaining:</span> {remainingText}
                </div>
                <div>
                  <span className="font-medium">Started:</span> {startDate.toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">Ends:</span> {endDate.toLocaleString()}
                </div>
              </>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const Product = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isBoostOpen, setIsBoostOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<ProductType | null>(
    null,
  );

  // Track if we've loaded data at least once (for initial skeleton only)
  const hasLoadedDataRef = useRef(false);

  // Debounce search input
  const debouncedSearch = useDebounce(search, 500);

  // Reset to page 1 when search changes
  useEffect(() => {
    if (debouncedSearch !== undefined) {
      setPage(1);
    }
  }, [debouncedSearch]);

  // Data Fetching
  const { data: productsData, isPending: isLoadingProducts } =
    usePaginateProducts({
      page,
      limit: pageSize,
      search: debouncedSearch || undefined,
    });

  // Mark as loaded once we have data
  useEffect(() => {
    if (productsData && !hasLoadedDataRef.current) {
      hasLoadedDataRef.current = true;
    }
  }, [productsData]);

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

  const openBoost = (product: ProductType) => {
    setCurrentProduct(product);
    setIsBoostOpen(true);
  };

  // Prepare data for Table
  const rows = productsData?.products.items || [];
  const totalItems = productsData?.products.total || 0;
  const isEmpty = rows.length === 0;
  const hasSearch = debouncedSearch && debouncedSearch.trim() !== "";
  const isEmptyWithSearch = isEmpty && hasSearch;

  // Prepare dropdown data
  const categories: Category[] =
    categoriesData?.categories || [];

  const conditions: ProductCondition[] =
    conditionsData?.product_conditions || [];

  const statuses: ProductStatus[] =
    statusesData?.product_status || [];

  // Show skeleton only on initial load (first time, no cached data)
  if (isLoadingProducts && !hasLoadedDataRef.current) {
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
                <TableToolbarSearch
                  value={search}
                  onChange={(_, value) => setSearch(value || "")}
                />
                <Button renderIcon={Add} onClick={() => setIsAddOpen(true)}>
                  Add Product
                </Button>
              </TableToolbarContent>
            </TableToolbar>
            <Table className="overflow-hidden" {...getTableProps()}>
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
                {isEmpty ? (
                  <TableRow>
                    <TableCell colSpan={TABLE_HEADERS.length}>
                      <div className="flex flex-col items-start justify-center gap-4 ps-5! py-5!">
                        {isEmptyWithSearch ? (
                          <>
                            <h3 className="text-xl font-semibold">
                              No results found
                            </h3>
                            <p className="text-gray-500 max-w-md">
                              No products match your search for "
                              {debouncedSearch}". Try adjusting your search
                              terms or clear the search to see all products.
                            </p>
                            <Button
                              kind="ghost"
                              onClick={() => setSearch("")}
                            >
                              Clear search
                            </Button>
                          </>
                        ) : (
                          <>
                            <h3 className="text-xl font-semibold">
                              No products yet
                            </h3>
                            <p className="text-gray-500 max-w-md">
                              Products help you manage your inventory. Create
                              your first product to get started.
                            </p>
                            <Button
                              renderIcon={Add}
                              onClick={() => setIsAddOpen(true)}
                            >
                              Add Product
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  tableRows.map((row) => {
                    const rowData = rows.find(
                      (r) => r.id.toString() === row.id,
                    );

                    if (!rowData) return null;

                    const categoryName =
                      (rowData.category?.name && rowData.category.name.trim()) || "N/A";

                    const conditionName =
                      (rowData.product_condition?.name && rowData.product_condition.name.trim()) || "Unknown";

                    const statusName =
                      (rowData.status?.name && rowData.status.name.trim()) || "Unknown";

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
                              <div className="shrink-0">
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
                        <TableCell>₱{rowData.price.toLocaleString()}</TableCell>
                        <TableCell>{categoryName}</TableCell>
                        <TableCell>
                          <Tag type="blue">{conditionName}</Tag>
                        </TableCell>
                        <TableCell>
                          <Tag type={statusType}>{statusName}</Tag>
                        </TableCell>
                        <TableCell>
                          {rowData.is_boosted && rowData.active_boost ? (
                            <div className="flex items-center gap-1.5">
                              <Tag
                                type={
                                  rowData.active_boost.boost_type === "top"
                                    ? "red"
                                    : rowData.active_boost.boost_type === "featured"
                                      ? "purple"
                                      : "cyan"
                                }
                                className="w-fit"
                              >
                                {rowData.active_boost.boost_type.toUpperCase()}
                              </Tag>
                              <BoostInfoPopover boost={rowData.active_boost} />
                            </div>
                          ) : (
                            <Tag type="gray" className="w-fit">
                              NO BOOST
                            </Tag>
                          )}
                        </TableCell>
                        <TableCell className="sticky right-0 bg-layer">
                          <OverflowMenu flipped>
                            <OverflowMenuItem
                              itemText="Boost"
                              onClick={() => openBoost(rowData)}
                            />
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
                  })
                )}
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

      {currentProduct && (
        <BoostModal
          open={isBoostOpen}
          onClose={() => {
            setIsBoostOpen(false);
            setCurrentProduct(null);
          }}
          itemType="product"
          itemId={currentProduct.id}
          itemName={currentProduct.name}
          existingBoost={currentProduct.active_boost || null}
        />
      )}
    </div>
  );
};
