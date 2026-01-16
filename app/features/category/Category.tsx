"use client";
import { Add, OverflowMenuHorizontal } from "@carbon/icons-react";
import {
  Button,
  DataTableSkeleton,
  OverflowMenu,
  OverflowMenuItem,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarAction,
  TableToolbarContent,
  TableToolbarMenu,
  TableToolbarSearch,
} from "@carbon/react";
import { useState, useRef, useEffect } from "react";
import { Category as CategoryType } from "@/app/types";
import { usePaginateCategories } from "./hooks";
import { CarbonLink } from "@/app/components";
import Link from "next/link";
import { CategoryStatusConst } from "@/app/constants";
import {
  CategoryModal,
  DeleteCategoryModal,
  UpdateCategoryStatusModal,
} from "./components";
import { useDebounce } from "@/app/hooks/useDebounce";

export const Category = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [dangerModalOpen, setDangerModalOpen] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  const [statusValue, setStatusValue] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
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

  const { data: paginateCategories, isPending: loadingPaginateCategories } =
    usePaginateCategories({
      page: page,
      limit: pageSize,
      search: debouncedSearch || undefined,
    });

  // Mark as loaded once we have data
  useEffect(() => {
    if (paginateCategories && !hasLoadedDataRef.current) {
      hasLoadedDataRef.current = true;
    }
  }, [paginateCategories]);

  const isEmpty = paginateCategories?.categories.total === 0;
  const hasSearch = debouncedSearch && debouncedSearch.trim() !== "";
  const isEmptyWithSearch = isEmpty && hasSearch;

  const handleOpenEdit = (category: CategoryType) => {
    setSelectedCategory(category);
    setOpen(true);
  };

  const handleOpenCreate = () => {
    setSelectedCategory(null);
    setOpen(true);
  };

  const handleCloseCreateEdit = () => {
    setOpen(false);
    setSelectedCategory(null);
  };

  const handleOpenDelete = (category: CategoryType) => {
    setSelectedCategory(category);
    setDangerModalOpen(true);
  };

  const handleCloseDelete = () => {
    setDangerModalOpen(false);
    setSelectedCategory(null);
  };

  const handleOpenStatus = (category: CategoryType, status: number) => {
    setSelectedCategory(category);
    setStatusValue(status);
    setStatusModal(true);
  };

  const handleCloseStatus = () => {
    setStatusModal(false);
    setSelectedCategory(null);
    setStatusValue(null);
  };

  return (
    <section>
      <CategoryModal
        open={open}
        onClose={handleCloseCreateEdit}
        category={selectedCategory}
      />

      <DeleteCategoryModal
        open={dangerModalOpen}
        onClose={handleCloseDelete}
        id={selectedCategory?.id || null}
      />

      <UpdateCategoryStatusModal
        open={statusModal}
        onClose={handleCloseStatus}
        id={selectedCategory?.id || null}
        statusValue={statusValue}
      />

      {loadingPaginateCategories && !hasLoadedDataRef.current ? (
        <DataTableSkeleton
          aria-label="Category table"
          headers={[
            { header: "Category Name", key: "name" },
            { header: "Category Status", key: "status" },
            { header: "Actions", key: "action" },
          ]}
          showHeader
          showToolbar
          columnCount={3}
        />
      ) : (
        <TableContainer
          title="Category"
          description="Manage your categories"
          className="p-0!"
        >
          <TableToolbar>
            <TableToolbarContent>
              <TableToolbarSearch
                value={search}
                onChange={(_, value) => setSearch(value || "")}
              />
              <TableToolbarMenu>
                <TableToolbarAction
                  onClick={() => {
                    console.log("");
                  }}
                >
                  Action 1
                </TableToolbarAction>
                <TableToolbarAction
                  onClick={() => {
                    console.log("Action 2 clicked");
                  }}
                >
                  Action 2
                </TableToolbarAction>
              </TableToolbarMenu>
              <Button renderIcon={Add} onClick={handleOpenCreate}>
                Add Category
              </Button>
            </TableToolbarContent>
          </TableToolbar>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Category Name</TableHeader>
                <TableHeader>Category Status</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {isEmpty ? (
                <TableRow>
                  <TableCell colSpan={3}>
                    <div className="flex flex-col items-start justify-center gap-4 ps-5! py-5!">
                      {isEmptyWithSearch ? (
                        <>
                          <h3 className="text-xl font-semibold">
                            No results found
                          </h3>
                          <p className="text-gray-500 max-w-md">
                            No categories match your search for "
                            {debouncedSearch}". Try adjusting your search terms
                            or clear the search to see all categories.
                          </p>
                          <Button kind="ghost" onClick={() => setSearch("")}>
                            Clear search
                          </Button>
                        </>
                      ) : (
                        <>
                          <h3 className="text-xl font-semibold">
                            No categories yet
                          </h3>
                          <p className="text-gray-500 max-w-md">
                            Categories help organize your products. Create your
                            first category to get started.
                          </p>
                          <Button renderIcon={Add} onClick={handleOpenCreate}>
                            Add Category
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginateCategories?.categories.items.map((items, index) => (
                  <TableRow key={index}>
                    <TableCell>{items.name}</TableCell>
                    <TableCell>
                      <CarbonLink as={Link} href="#">
                        {
                          CategoryStatusConst[
                            items.status_id as keyof typeof CategoryStatusConst
                          ]
                        }
                      </CarbonLink>
                    </TableCell>
                    <TableCell>
                      <OverflowMenu
                        aria-label="actions"
                        renderIcon={OverflowMenuHorizontal}
                        flipped
                      >
                        <OverflowMenuItem
                          itemText="Edit"
                          onClick={() => handleOpenEdit(items)}
                        />
                        <OverflowMenuItem
                          hasDivider
                          itemText="Set Active"
                          disabled={items.status_id === 1}
                          onClick={() => handleOpenStatus(items, 1)}
                        />
                        <OverflowMenuItem
                          itemText="Set Inactive"
                          disabled={items.status_id === 2}
                          onClick={() => handleOpenStatus(items, 2)}
                        />
                        <OverflowMenuItem
                          disabled={items.status_id === 3}
                          itemText="Set Draft"
                          onClick={() => handleOpenStatus(items, 3)}
                        />
                        <OverflowMenuItem
                          hasDivider
                          itemText="Delete"
                          isDelete
                          onClick={() => handleOpenDelete(items)}
                        />
                      </OverflowMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <Pagination
            backwardText="Previous page"
            forwardText="Next page"
            itemsPerPageText="Items per page:"
            page={page}
            pageSize={pageSize}
            pageSizes={[10, 20, 30, 40, 50]}
            totalItems={paginateCategories?.categories.total || 0}
            onChange={({ page, pageSize }) => {
              setPage(page);
              setPageSize(pageSize);
            }}
          />
        </TableContainer>
      )}
    </section>
  );
};
