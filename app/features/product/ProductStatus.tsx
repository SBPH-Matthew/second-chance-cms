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
import { ProductStatusResponse } from "@/app/types/product";
import { useGetProductStatuses } from "./hooks";
import { ProductStatusModal } from "./components/ProductStatusModal";
import { DeleteProductStatusModal } from "./components/DeleteProductStatusModal";

export const ProductStatus = () => {
  const [open, setOpen] = useState(false);
  const [dangerModalOpen, setDangerModalOpen] = useState(false);
  const [selectedProductStatus, setSelectedProductStatus] =
    useState<ProductStatusResponse | null>(null);

  const { data: productStatusesData, isPending: loadingProductStatuses } =
    useGetProductStatuses();

  const isEmpty = productStatusesData?.product_status.length === 0;

  const handleOpenEdit = (productStatus: ProductStatusResponse) => {
    setSelectedProductStatus(productStatus);
    setOpen(true);
  };

  const handleOpenCreate = () => {
    setSelectedProductStatus(null);
    setOpen(true);
  };

  const handleCloseCreateEdit = () => {
    setOpen(false);
    setSelectedProductStatus(null);
  };

  const handleOpenDelete = (productStatus: ProductStatusResponse) => {
    setSelectedProductStatus(productStatus);
    setDangerModalOpen(true);
  };

  const handleCloseDelete = () => {
    setDangerModalOpen(false);
    setSelectedProductStatus(null);
  };

  return (
    <section>
      <ProductStatusModal
        open={open}
        onClose={handleCloseCreateEdit}
        productStatus={selectedProductStatus}
      />

      <DeleteProductStatusModal
        open={dangerModalOpen}
        onClose={handleCloseDelete}
        id={selectedProductStatus?.id || null}
      />

      {loadingProductStatuses ? (
        <DataTableSkeleton
          aria-label="Product Status table"
          headers={[
            { header: "Product Status Name", key: "name" },
            { header: "Actions", key: "action" },
          ]}
          showHeader
          showToolbar
          columnCount={2}
        />
      ) : (
        <TableContainer
          title="Product Status"
          description="Manage your product status options"
          className="p-0!"
        >
          <TableToolbar>
            <TableToolbarContent>
              <TableToolbarSearch />
              <Button renderIcon={Add} onClick={handleOpenCreate}>
                Add Product Status
              </Button>
            </TableToolbarContent>
          </TableToolbar>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Product Status Name</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {isEmpty ? (
                <TableRow>
                  <TableCell colSpan={2}>
                    <div className="flex flex-col items-start justify-center gap-4 ps-5! py-5!">
                      <h3 className="text-xl font-semibold">
                        No product statuses yet
                      </h3>
                      <p className="text-gray-500 max-w-md">
                        Product statuses help define the lifecycle states of
                        your products. Create your first product status to get
                        started.
                      </p>
                      <Button renderIcon={Add} onClick={handleOpenCreate}>
                        Add Product Status
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                productStatusesData?.product_status.map((status) => (
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
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </section>
  );
};
