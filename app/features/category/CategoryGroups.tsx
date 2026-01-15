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
import { CategoryGroup } from "@/app/types";
import { useGetCategoryGroups } from "./hooks";
import { CategoryGroupModal } from "./components/CategoryGroupModal";
import { DeleteCategoryGroupModal } from "./components/DeleteCategoryGroupModal";

export const CategoryGroups = () => {
  const [open, setOpen] = useState(false);
  const [dangerModalOpen, setDangerModalOpen] = useState(false);
  const [selectedCategoryGroup, setSelectedCategoryGroup] =
    useState<CategoryGroup | null>(null);

  const { data: categoryGroupsData, isPending: loadingCategoryGroups } =
    useGetCategoryGroups();

  const isEmpty = categoryGroupsData?.category_groups.length === 0;

  const handleOpenEdit = (categoryGroup: CategoryGroup) => {
    setSelectedCategoryGroup(categoryGroup);
    setOpen(true);
  };

  const handleOpenCreate = () => {
    setSelectedCategoryGroup(null);
    setOpen(true);
  };

  const handleCloseCreateEdit = () => {
    setOpen(false);
    setSelectedCategoryGroup(null);
  };

  const handleOpenDelete = (categoryGroup: CategoryGroup) => {
    setSelectedCategoryGroup(categoryGroup);
    setDangerModalOpen(true);
  };

  const handleCloseDelete = () => {
    setDangerModalOpen(false);
    setSelectedCategoryGroup(null);
  };

  return (
    <section>
      <CategoryGroupModal
        open={open}
        onClose={handleCloseCreateEdit}
        categoryGroup={selectedCategoryGroup}
      />

      <DeleteCategoryGroupModal
        open={dangerModalOpen}
        onClose={handleCloseDelete}
        id={selectedCategoryGroup?.id || null}
      />

      {loadingCategoryGroups ? (
        <DataTableSkeleton
          aria-label="Category Groups table"
          headers={[
            { header: "Category Group Name", key: "name" },
            { header: "Actions", key: "action" },
          ]}
          showHeader
          showToolbar
          columnCount={2}
        />
      ) : (
        <TableContainer
          title="Category Groups"
          description="Manage your category groups"
          className="p-0!"
        >
          <TableToolbar>
            <TableToolbarContent>
              <TableToolbarSearch />
              <Button renderIcon={Add} onClick={handleOpenCreate}>
                Add Category Group
              </Button>
            </TableToolbarContent>
          </TableToolbar>
          {isEmpty ? (
            <div className="flex flex-col items-start justify-center py-16 gap-4 ps-5! pt-5!">
              <h3 className="text-xl font-semibold">No category groups yet</h3>
              <p className="text-gray-500 max-w-md">
                Category groups help organize your categories. Create your first
                category group to get started.
              </p>
              <Button renderIcon={Add} onClick={handleOpenCreate}>
                Add Category Group
              </Button>
            </div>
          ) : (
            <>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>Category Group Name</TableHeader>
                    <TableHeader>Actions</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categoryGroupsData?.category_groups.map((group) => (
                    <TableRow key={group.id}>
                      <TableCell>{group.name}</TableCell>
                      <TableCell>
                        <OverflowMenu
                          aria-label="actions"
                          renderIcon={OverflowMenuHorizontal}
                          flipped
                        >
                          <OverflowMenuItem
                            itemText="Edit"
                            onClick={() => handleOpenEdit(group)}
                          />
                          <OverflowMenuItem
                            hasDivider
                            itemText="Delete"
                            isDelete
                            onClick={() => handleOpenDelete(group)}
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
