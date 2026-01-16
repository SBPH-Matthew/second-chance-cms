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
  Tag,
  OverflowMenu,
  OverflowMenuItem,
  TableToolbarSearch,
} from "@carbon/react";
import { Add } from "@carbon/icons-react";
import { useState, useRef, useEffect } from "react";
import {
  CreateVehicleRequest,
  Vehicle as VehicleType,
} from "@/app/types/vehicle";
import { VehicleFormModal } from "./components/VehicleFormModal";
import { DeleteVehicleModal } from "./components/DeleteVehicleModal";
import {
  useCreateVehicle,
  useGetVehicleTypes,
  usePaginateVehicles,
  useUpdateVehicle,
} from "./hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "@/app/hooks/useDebounce";

const TABLE_HEADERS = [
  { key: "vehicle", header: "Vehicle" },
  { key: "year", header: "Year" },
  { key: "price", header: "Price" },
  { key: "vehicleType", header: "Vehicle Type" },
  { key: "location", header: "Location" },
  { key: "actions", header: "" },
];

export const Vehicle = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<VehicleType | null>(
    null
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
  const { data: vehiclesData, isPending: isLoadingVehicles } =
    usePaginateVehicles({
      page,
      limit: pageSize,
      search: debouncedSearch || undefined,
    });

  // Mark as loaded once we have data
  useEffect(() => {
    if (vehiclesData && !hasLoadedDataRef.current) {
      hasLoadedDataRef.current = true;
    }
  }, [vehiclesData]);

  const { data: vehicleTypesData } = useGetVehicleTypes();

  // Mutations
  const {
    mutateAsync: createVehicle,
    isPending: isCreating,
    reset: resetCreate,
  } = useCreateVehicle();

  const {
    mutateAsync: updateVehicle,
    isPending: isUpdating,
    reset: resetUpdate,
  } = useUpdateVehicle();

  // Handlers
  const handleAdd = (data: CreateVehicleRequest) => {
    createVehicle(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["paginate-vehicles"],
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

  const handleEdit = (data: CreateVehicleRequest) => {
    if (!currentVehicle) return;

    updateVehicle(
      {
        id: currentVehicle.id,
        payload: data,
        initialData: currentVehicle,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["paginate-vehicles"],
          });
          setTimeout(() => {
            setIsEditOpen(false);
            setCurrentVehicle(null);
            resetUpdate();
          }, 500);
        },
        onError: () => {
          setTimeout(() => {
            resetUpdate();
          }, 2000);
        },
      }
    );
  };

  const openEdit = (vehicle: VehicleType) => {
    setCurrentVehicle(vehicle);
    setIsEditOpen(true);
  };

  const openDelete = (vehicle: VehicleType) => {
    setCurrentVehicle(vehicle);
    setIsDeleteOpen(true);
  };

  // Prepare data for Table
  // Map the API response to match our expected format (snake_case from backend)
  const rows = (vehiclesData?.vehicles.items || []).map((item: VehicleType) => {
    const vehicleMake = item.vehicle_make || "";
    const vehicleModel = item.vehicle_model || "";
    const vehicleTypeName = item.vehicle_type?.name || "";

    return {
      id: item.id,
      vehicleMake,
      vehicleModel,
      vehicle: `${vehicleMake} ${vehicleModel}`, // Combined field for display
      year: item.year || "",
      price: item.price || 0,
      description: item.description || "",
      location: item.location || "",
      images: item.images || [],
      vehicleTypeId: item.vehicle_type_id,
      sellerId: item.seller_id,
      vehicleType: item.vehicle_type
        ? {
            id: item.vehicle_type.id,
            name: vehicleTypeName,
          }
        : undefined,
      seller: item.seller,
      // Store original vehicle object for edit/delete operations
      originalVehicle: item,
    };
  });
  const totalItems = vehiclesData?.vehicles.total || 0;

  // Prepare vehicle types
  const vehicleTypes = vehicleTypesData?.vehicleTypes.items || [];

  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith("http")) {
      return imagePath;
    }
    const apiUrl = process.env.NEXT_PUBLIC_API || "";
    return `${apiUrl}${imagePath}`;
  };

  // Show skeleton only on initial load (first time, no cached data)
  if (isLoadingVehicles && !hasLoadedDataRef.current) {
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
        }) => {
          const isEmpty = rows.length === 0;
          const hasSearch = debouncedSearch && debouncedSearch.trim() !== "";
          const isEmptyWithSearch = isEmpty && hasSearch;

          return (
            <TableContainer
              className="p-0!"
              title="Vehicles"
              description="Manage your vehicle inventory"
            >
              <TableToolbar>
                <TableToolbarContent>
                  <TableToolbarSearch
                    value={search}
                    onChange={(_, value) => setSearch(value || "")}
                  />
                  <Button renderIcon={Add} onClick={() => setIsAddOpen(true)}>
                    Add Vehicle
                  </Button>
                </TableToolbarContent>
              </TableToolbar>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (
                      <TableHeader {...getHeaderProps({ header })}>
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
                                No vehicles match your search for "
                                {debouncedSearch}". Try adjusting your search
                                terms or clear the search to see all vehicles.
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
                                No vehicles yet
                              </h3>
                              <p className="text-gray-500 max-w-md">
                                Vehicles help you manage your inventory. Create
                                your first vehicle to get started.
                              </p>
                              <Button
                                renderIcon={Add}
                                onClick={() => setIsAddOpen(true)}
                              >
                                Add Vehicle
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    tableRows.map((row: any) => {
                      const rowData = rows.find(
                        (r) => r.id?.toString() === row.id
                      );

                      if (!rowData) return null;

                      const vehicleTypeName =
                        (rowData.vehicleType?.name &&
                          rowData.vehicleType.name.trim()) ||
                        "N/A";

                      return (
                        <TableRow {...getRowProps({ row })} key={row.id}>
                          <TableCell>
                            <div className="flex gap-3">
                              {rowData.images && rowData.images.length > 0 && (
                                <div className="shrink-0!">
                                  <img
                                    src={getImageUrl(rowData.images[0])}
                                    alt={`${rowData.vehicleMake || ""} ${
                                      rowData.vehicleModel || ""
                                    }`}
                                    className="w-16 h-16 object-cover rounded border"
                                    onError={(e) => {
                                      (
                                        e.target as HTMLImageElement
                                      ).style.display = "none";
                                    }}
                                  />
                                </div>
                              )}
                              <div className="flex flex-col gap-1 flex-1 min-w-0">
                                <strong>
                                  {rowData.vehicleMake} {rowData.vehicleModel}
                                </strong>
                                {rowData.description && (
                                  <div
                                    className="text-xs text-gray-500 truncate max-w-xs"
                                    title={rowData.description}
                                  >
                                    {rowData.description}
                                  </div>
                                )}
                                {rowData.images &&
                                  rowData.images.length > 1 && (
                                    <div className="text-xs text-gray-400">
                                      +{rowData.images.length - 1} more image
                                      {rowData.images.length - 1 > 1 ? "s" : ""}
                                    </div>
                                  )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{rowData.year}</TableCell>
                          <TableCell>
                            ₱{rowData.price?.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {rowData.vehicleType ? (
                              <Tag type="blue">{vehicleTypeName}</Tag>
                            ) : (
                              <span className="text-gray-400">N/A</span>
                            )}
                          </TableCell>
                          <TableCell>{rowData.location || "N/A"}</TableCell>
                          <TableCell>
                            <OverflowMenu flipped>
                              <OverflowMenuItem
                                itemText="Edit"
                                onClick={() => {
                                  const originalVehicle = (rowData as any)
                                    .originalVehicle as VehicleType;
                                  if (originalVehicle)
                                    openEdit(originalVehicle);
                                }}
                              />
                              <OverflowMenuItem
                                itemText="Delete"
                                onClick={() => {
                                  const originalVehicle = (rowData as any)
                                    .originalVehicle as VehicleType;
                                  if (originalVehicle)
                                    openDelete(originalVehicle);
                                }}
                                isDelete
                              />
                            </OverflowMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
              <Pagination
                backwardText="Previous page"
                forwardText="Next page"
                itemsPerPageText="Items per page:"
                page={page}
                pageNumberText="Page Number"
                pageSize={pageSize}
                pageSizes={[10, 20, 30, 50, 100]}
                totalItems={totalItems}
                onChange={({ page, pageSize }) => {
                  setPage(page);
                  setPageSize(pageSize);
                }}
              />
            </TableContainer>
          );
        }}
      </DataTable>

      <VehicleFormModal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAdd}
        vehicleTypes={vehicleTypes}
        isSubmitting={isCreating}
      />

      <VehicleFormModal
        open={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setCurrentVehicle(null);
        }}
        onSubmit={handleEdit}
        initialData={currentVehicle || undefined}
        vehicleTypes={vehicleTypes}
        isSubmitting={isUpdating}
      />

      <DeleteVehicleModal
        open={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setCurrentVehicle(null);
        }}
        vehicleId={currentVehicle?.id || null}
        vehicleName={`${currentVehicle?.vehicle_make || ""} ${
          currentVehicle?.vehicle_model || ""
        }`}
      />
    </div>
  );
};
