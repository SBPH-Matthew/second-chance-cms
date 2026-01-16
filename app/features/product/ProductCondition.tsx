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
import { ProductConditionResponse } from "@/app/types/product";
import { useGetProductConditions } from "./hooks";
import { ProductConditionModal } from "./components/ProductConditionModal";
import { DeleteProductConditionModal } from "./components/DeleteProductConditionModal";

export const ProductCondition = () => {
  const [open, setOpen] = useState(false);
  const [dangerModalOpen, setDangerModalOpen] = useState(false);
  const [selectedProductCondition, setSelectedProductCondition] =
    useState<ProductConditionResponse | null>(null);

  const { data: productConditionsData, isPending: loadingProductConditions } =
    useGetProductConditions();

  const isEmpty = productConditionsData?.product_conditions.length === 0;

  const handleOpenEdit = (productCondition: ProductConditionResponse) => {
    setSelectedProductCondition(productCondition);
    setOpen(true);
  };

  const handleOpenCreate = () => {
    setSelectedProductCondition(null);
    setOpen(true);
  };

  const handleCloseCreateEdit = () => {
    setOpen(false);
    setSelectedProductCondition(null);
  };

  const handleOpenDelete = (productCondition: ProductConditionResponse) => {
    setSelectedProductCondition(productCondition);
    setDangerModalOpen(true);
  };

  const handleCloseDelete = () => {
    setDangerModalOpen(false);
    setSelectedProductCondition(null);
  };

  return (
    <section>
      <ProductConditionModal
        open={open}
        onClose={handleCloseCreateEdit}
        productCondition={selectedProductCondition}
      />

      <DeleteProductConditionModal
        open={dangerModalOpen}
        onClose={handleCloseDelete}
        id={selectedProductCondition?.id || null}
      />

      {loadingProductConditions ? (
        <DataTableSkeleton
          aria-label="Product Condition table"
          headers={[
            { header: "Product Condition Name", key: "name" },
            { header: "Actions", key: "action" },
          ]}
          showHeader
          showToolbar
          columnCount={2}
        />
      ) : (
        <TableContainer
          title="Product Condition"
          description="Manage your product condition options"
          className="p-0!"
        >
          <TableToolbar>
            <TableToolbarContent>
              <TableToolbarSearch />
              <Button renderIcon={Add} onClick={handleOpenCreate}>
                Add Product Condition
              </Button>
            </TableToolbarContent>
          </TableToolbar>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Product Condition Name</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {isEmpty ? (
                <TableRow>
                  <TableCell colSpan={2}>
                    <div className="flex flex-col items-start justify-center gap-4 ps-5! py-5!">
                      <h3 className="text-xl font-semibold">
                        No product conditions yet
                      </h3>
                      <p className="text-gray-500 max-w-md">
                        Product conditions help define the physical state of
                        your products. Create your first product condition to
                        get started.
                      </p>
                      <Button renderIcon={Add} onClick={handleOpenCreate}>
                        Add Product Condition
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                productConditionsData?.product_conditions.map((condition) => (
                  <TableRow key={condition.id}>
                    <TableCell>{condition.name}</TableCell>
                    <TableCell>
                      <OverflowMenu
                        aria-label="actions"
                        renderIcon={OverflowMenuHorizontal}
                        flipped
                      >
                        <OverflowMenuItem
                          itemText="Edit"
                          onClick={() => handleOpenEdit(condition)}
                        />
                        <OverflowMenuItem
                          hasDivider
                          itemText="Delete"
                          isDelete
                          onClick={() => handleOpenDelete(condition)}
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
