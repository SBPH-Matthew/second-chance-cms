"use client";

import { Add, OverflowMenuHorizontal } from "@carbon/icons-react";
import {
  Button,
  DataTableSkeleton,
  OverflowMenu,
  OverflowMenuItem,
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
} from "@carbon/react";
import { useState } from "react";
import { VehicleType } from "@/app/types/vehicle";
import { useGetVehicleTypesList } from "./hooks";
import { VehicleTypeModal } from "./components/VehicleTypeModal";
import { DeleteVehicleTypeModal } from "./components/DeleteVehicleTypeModal";

export const VehicleTypeComponent = () => {
  const [open, setOpen] = useState(false);
  const [dangerModalOpen, setDangerModalOpen] = useState(false);
  const [selectedVehicleType, setSelectedVehicleType] =
    useState<VehicleType | null>(null);

  const { data: vehicleTypesData, isPending: loadingVehicleTypes } =
    useGetVehicleTypesList();

  const isEmpty = vehicleTypesData?.vehicleTypes.items.length === 0;

  const handleOpenEdit = (vehicleType: VehicleType) => {
    setSelectedVehicleType(vehicleType);
    setOpen(true);
  };

  const handleOpenCreate = () => {
    setSelectedVehicleType(null);
    setOpen(true);
  };

  const handleCloseCreateEdit = () => {
    setOpen(false);
    setSelectedVehicleType(null);
  };

  const handleOpenDelete = (vehicleType: VehicleType) => {
    setSelectedVehicleType(vehicleType);
    setDangerModalOpen(true);
  };

  const handleCloseDelete = () => {
    setDangerModalOpen(false);
    setSelectedVehicleType(null);
  };

  return (
    <section>
      <VehicleTypeModal
        open={open}
        onClose={handleCloseCreateEdit}
        vehicleType={selectedVehicleType}
      />

      <DeleteVehicleTypeModal
        open={dangerModalOpen}
        onClose={handleCloseDelete}
        id={selectedVehicleType?.id || null}
      />

      {loadingVehicleTypes ? (
        <DataTableSkeleton
          aria-label="Vehicle Type table"
          headers={[
            { header: "Vehicle Type Name", key: "name" },
            { header: "Actions", key: "action" },
          ]}
          showHeader
          showToolbar
          columnCount={2}
        />
      ) : (
        <TableContainer
          title="Vehicle Type"
          description="Manage your vehicle type options"
          className="p-0!"
        >
          <TableToolbar>
            <TableToolbarContent>
              <TableToolbarSearch />
              <Button renderIcon={Add} onClick={handleOpenCreate}>
                Add Vehicle Type
              </Button>
            </TableToolbarContent>
          </TableToolbar>
          {isEmpty ? (
            <div className="flex flex-col items-start justify-center py-16 gap-4 ps-5! pt-5!">
              <h3 className="text-xl font-semibold">No vehicle types yet</h3>
              <p className="text-gray-500 max-w-md">
                Vehicle types help categorize your vehicles. Create your first
                vehicle type to get started.
              </p>
              <Button renderIcon={Add} onClick={handleOpenCreate}>
                Add Vehicle Type
              </Button>
            </div>
          ) : (
            <>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>Vehicle Type Name</TableHeader>
                    <TableHeader>Actions</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vehicleTypesData?.vehicleTypes.items.map((vehicleType) => (
                    <TableRow key={vehicleType.id}>
                      <TableCell>{vehicleType.name}</TableCell>
                      <TableCell>
                        <OverflowMenu
                          aria-label="actions"
                          renderIcon={OverflowMenuHorizontal}
                          flipped
                        >
                          <OverflowMenuItem
                            itemText="Edit"
                            onClick={() => handleOpenEdit(vehicleType)}
                          />
                          <OverflowMenuItem
                            hasDivider
                            itemText="Delete"
                            isDelete
                            onClick={() => handleOpenDelete(vehicleType)}
                          />
                        </OverflowMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </TableContainer>
      )}
    </section>
  );
};
