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
import { Add, Edit, TrashCan } from "@carbon/icons-react";
import { useState } from "react";
import {
  CreateVehicleRequest,
  Vehicle as VehicleType,
} from "@/app/types/vehicle";
import { VehicleFormModal } from "./components/VehicleFormModal";
import { DeleteVehicleModal } from "./components/DeleteVehicleModal";
import {
  useCreateVehicle,
  useDeleteVehicle,
  useGetVehicleTypes,
  usePaginateVehicles,
  useUpdateVehicle,
} from "./hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useModalLoading } from "@/app/hooks";

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
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<VehicleType | null>(
    null
  );

  // Data Fetching
  const { data: vehiclesData, isPending: isLoadingVehicles } =
    usePaginateVehicles({
      page,
      limit: pageSize,
    });

  const { data: vehicleTypesData } = useGetVehicleTypes();

  // Mutations
  const {
    mutateAsync: createVehicle,
    isPending: isCreating,
    isSuccess: isCreateSuccess,
    isError: isCreateError,
    reset: resetCreate,
  } = useCreateVehicle();

  const {
    mutateAsync: updateVehicle,
    isPending: isUpdating,
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
    reset: resetUpdate,
  } = useUpdateVehicle();

  const {
    mutateAsync: deleteVehicle,
    isPending: isDeleting,
    isSuccess: isDeleteSuccess,
    isError: isDeleteError,
    reset: resetDelete,
  } = useDeleteVehicle();

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
  // Map the API response to match our expected format (handle both camelCase and PascalCase)
  const rows = (vehiclesData?.vehicles.items || []).map((item: any) => ({
    id: item.id || item.ID,
    vehicleMake: item.vehicleMake || item.VehicleMake,
    vehicleModel: item.vehicleModel || item.VehicleModel,
    year: item.year || item.Year,
    price: item.price || item.Price,
    description: item.description || item.Description,
    location: item.location || item.Location,
    images: item.images || item.Images || [],
    vehicleTypeId: item.vehicleTypeId || item.VehicleTypeID,
    sellerId: item.sellerId || item.SellerID,
    vehicleType:
      item.vehicleType || item.VehicleType
        ? {
            id:
              (item.vehicleType || item.VehicleType).id ||
              (item.vehicleType || item.VehicleType).ID,
            name:
              (item.vehicleType || item.VehicleType).name ||
              (item.vehicleType || item.VehicleType).Name,
          }
        : undefined,
    seller: item.seller || item.Seller,
  }));
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

  if (isLoadingVehicles) {
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
            title="Vehicles"
            description="Manage your vehicle inventory"
          >
            <TableToolbar>
              <TableToolbarContent>
                <TableToolbarSearch />
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
                {tableRows.map((row) => {
                  const rowData = rows.find((r) => r.id?.toString() === row.id);

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
                            <div className="flex-shrink-0">
                              <img
                                src={getImageUrl(rowData.images[0])}
                                alt={`${rowData.vehicleMake} ${rowData.vehicleModel}`}
                                className="w-16 h-16 object-cover rounded border"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display =
                                    "none";
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
                            {rowData.images && rowData.images.length > 1 && (
                              <div className="text-xs text-gray-400">
                                +{rowData.images.length - 1} more image
                                {rowData.images.length - 1 > 1 ? "s" : ""}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{rowData.year}</TableCell>
                      <TableCell>₱{rowData.price?.toLocaleString()}</TableCell>
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
                            onClick={() => openEdit(rowData)}
                          />
                          <OverflowMenuItem
                            itemText="Delete"
                            onClick={() => openDelete(rowData)}
                            isDelete
                          />
                        </OverflowMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
        )}
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
        vehicleName={`${currentVehicle?.vehicleMake} ${currentVehicle?.vehicleModel}`}
      />
    </div>
  );
};
