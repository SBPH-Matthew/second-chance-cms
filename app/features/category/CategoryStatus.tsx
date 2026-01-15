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
import { CategoryStatus as CategoryStatusType } from "@/app/types";
import { useGetCategoryStatuses } from "./hooks";
import { CategoryStatusModal } from "./components/CategoryStatusModal";
import { DeleteCategoryStatusModal } from "./components/DeleteCategoryStatusModal";

export const CategoryStatus = () => {
  const [open, setOpen] = useState(false);
  const [dangerModalOpen, setDangerModalOpen] = useState(false);
  const [selectedCategoryStatus, setSelectedCategoryStatus] =
    useState<CategoryStatusType | null>(null);

  const { data: categoryStatusesData, isPending: loadingCategoryStatuses } =
    useGetCategoryStatuses();

  const isEmpty = categoryStatusesData?.category_statuses.length === 0;

  const handleOpenEdit = (categoryStatus: CategoryStatusType) => {
    setSelectedCategoryStatus(categoryStatus);
    setOpen(true);
  };

  const handleOpenCreate = () => {
    setSelectedCategoryStatus(null);
    setOpen(true);
  };

  const handleCloseCreateEdit = () => {
    setOpen(false);
    setSelectedCategoryStatus(null);
  };

  const handleOpenDelete = (categoryStatus: CategoryStatusType) => {
    setSelectedCategoryStatus(categoryStatus);
    setDangerModalOpen(true);
  };

  const handleCloseDelete = () => {
    setDangerModalOpen(false);
    setSelectedCategoryStatus(null);
  };

  return (
    <section>
      <CategoryStatusModal
        open={open}
        onClose={handleCloseCreateEdit}
        categoryStatus={selectedCategoryStatus}
      />

      <DeleteCategoryStatusModal
        open={dangerModalOpen}
        onClose={handleCloseDelete}
        id={selectedCategoryStatus?.id || null}
      />

      {loadingCategoryStatuses ? (
        <DataTableSkeleton
          aria-label="Category Status table"
          headers={[
            { header: "Category Status Name", key: "name" },
            { header: "Actions", key: "action" },
          ]}
          showHeader
          showToolbar
          columnCount={2}
        />
      ) : (
        <TableContainer
          title="Category Status"
          description="Manage your category status options"
          className="p-0!"
        >
          <TableToolbar>
            <TableToolbarContent>
              <TableToolbarSearch />
              <Button renderIcon={Add} onClick={handleOpenCreate}>
                Add Category Status
              </Button>
            </TableToolbarContent>
          </TableToolbar>
          {isEmpty ? (
            <div className="flex flex-col items-start justify-center py-16 gap-4 ps-5! pt-5!">
              <h3 className="text-xl font-semibold">
                No category statuses yet
              </h3>
              <p className="text-gray-500 max-w-md">
                Category statuses help define the lifecycle states of your
                categories. Create your first category status to get started.
              </p>
              <Button renderIcon={Add} onClick={handleOpenCreate}>
                Add Category Status
              </Button>
            </div>
          ) : (
            <>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>Category Status Name</TableHeader>
                    <TableHeader>Actions</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categoryStatusesData?.category_statuses.map((status) => (
                    <TableRow key={status.id}>
                      <TableCell>{status.name}</TableCell>
                      <TableCell>
                        <OverflowMenu
                          aria-label="actions"
                          renderIcon={OverflowMenuHorizontal}
                          flipped
                        >
                          <OverflowMenuItem
                            itemText="Edit"
                            onClick={() => handleOpenEdit(status)}
                          />
                          <OverflowMenuItem
                            hasDivider
                            itemText="Delete"
                            isDelete
                            onClick={() => handleOpenDelete(status)}
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
