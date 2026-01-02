"use client";
import { Add, OverflowMenuHorizontal } from "@carbon/icons-react";
import {
  Button,
  DataTableSkeleton,
  Form,
  Modal,
  OverflowMenu,
  OverflowMenuItem,
  Pagination,
  Select,
  SelectItem,
  SelectSkeleton,
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
  TextInput,
} from "@carbon/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  CreateCategoryRequest,
  CreateCategorySchema,
  ValidationResponse,
} from "@/app/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateCategory,
  useDeleteCategory,
  useGetCategoryGroups,
  useGetCategoryStatuses,
  usePaginateCategories,
  useSetCategoryStatus,
  useUpdateCategory,
} from "./hooks";
import { useModalLoading } from "@/app/hooks";
import { CarbonLink } from "@/app/components";
import Link from "next/link";
import { CategoryStatusConst } from "@/app/constants";
import { useQueryClient } from "@tanstack/react-query";

export const Category = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [open, setOpen] = useState(false);
  const [dangerModalOpen, setDangerModalOpen] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  const [statusValue, setStatusValue] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const { data: categoryGroups, isPending: loadingCategoryGroups } =
    useGetCategoryGroups();
  const { data: categoryStatuses, isPending: loadingCategoryStatuses } =
    useGetCategoryStatuses();
  const { data: paginateCategories, isPending: loadingPaginateCategories } =
    usePaginateCategories({
      page: page,
      limit: pageSize,
    });
  const {
    mutateAsync: deleteCategory,
    isPending: isDeleting,
    isSuccess: successDelete,
    isError: errorDelete,
    reset: resetDelete,
  } = useDeleteCategory();
  const {
    mutateAsync: SetCategoryStatus,
    isPending: isSettingStatus,
    isSuccess: statusSuccess,
    isError: statusError,
  } = useSetCategoryStatus();

  const isEmpty = paginateCategories?.categories.total === 0;

  const {
    mutateAsync: CreateCategory,
    isPending: isCreating,
    isError: createError,
    isSuccess: createSuccess,
    reset: resetCreate,
  } = useCreateCategory();

  const {
    mutateAsync: UpdateCategory,
    isPending: isUpdating,
    isError: updateError,
    isSuccess: updateSuccess,
    reset: resetUpdate,
  } = useUpdateCategory();

  const { status } = useModalLoading({
    loading: isCreating || isUpdating,
    success: createSuccess || updateSuccess,
    error: createError || updateError,
  });

  const { status: deleteStatus } = useModalLoading({
    loading: isDeleting,
    success: successDelete,
    error: errorDelete,
  });

  const { status: changeStatusPending } = useModalLoading({
    loading: isSettingStatus,
    success: statusSuccess,
    error: statusError,
  });

  const handleModal = () => {
    if (open) {
      setSelectedCategory(null);
      form.reset({
        name: "",
        category_group: "",
        status: "",
      });
    }
    setOpen(!open);
  };

  const form = useForm({
    resolver: zodResolver(CreateCategorySchema),
    mode: "all",
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = form;

  const onSubmit = (payload: CreateCategoryRequest) => {
    const mutationProvider = selectedCategory
      ? UpdateCategory({ id: selectedCategory, payload: payload })
      : CreateCategory(payload);

    mutationProvider
      .then(() => {
        setTimeout(() => {
          setPage(1);

          form.reset({ name: "", category_group: "", status: "" });

          handleModal();

          resetCreate();
          resetUpdate();
          queryClient.invalidateQueries({
            queryKey: ["paginate-categories"],
          });
        }, 500);
      })
      .catch((error: ValidationResponse) => {
        if (error.errors) {
          const serverErrors = error.errors;
          Object.entries(serverErrors).forEach(([field, message]) => {
            setError(field as keyof CreateCategoryRequest, {
              type: "server",
              message: message ?? "Error",
            });
          });
        }
      });
  };

  const handleDeleteModal = () => {
    if (selectedCategory) {
      setSelectedCategory(null);
    }
    setDangerModalOpen((prev) => !prev);
  };

  const handleStatusModal = () => {
    if (selectedCategory) {
      setSelectedCategory(null);
    }
    setStatusModal((prev) => !prev);
  };

  const handleDelete = () => {
    if (selectedCategory) {
      deleteCategory(selectedCategory, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["paginate-categories"],
          });
          setTimeout(() => {
            setPage(1);
            resetDelete();
            handleDeleteModal();
          }, 500);
        },
        onError: (error) => {
          console.error("Error deleting category:", error);
        },
      });
    }
  };

  const handleChangeStatus = () => {
    if (!statusValue) return;
    if (selectedCategory) {
      SetCategoryStatus(
        {
          id: selectedCategory,
          status: statusValue,
        },
        {
          onSuccess: () => {
            setPage(1);
            queryClient.invalidateQueries({
              queryKey: ["paginate-categories"],
            });
            handleStatusModal();
          },
        },
      );
    }
  };

  return (
    <section>
      <Modal
        aria-label={selectedCategory ? "Edit category" : "Add category"}
        modalHeading={selectedCategory ? "Edit Category" : "Add Category"}
        open={open}
        onRequestClose={handleModal}
        primaryButtonText={selectedCategory ? "Save" : "Add"}
        secondaryButtonText="Cancel"
        size="sm"
        loadingStatus={status}
        loadingDescription={selectedCategory ? "Updating..." : "Creating..."}
        onRequestSubmit={handleSubmit(onSubmit)}
      >
        <Form className="flex flex-col gap-5">
          <TextInput
            id="name"
            labelText="Name"
            size="lg"
            placeholder="Category Name"
            {...register("name")}
            invalid={errors.name ? true : false}
            invalidText={errors.name?.message}
          />
          {loadingCategoryGroups ? (
            <SelectSkeleton />
          ) : (
            <Select
              id="category_group"
              labelText="Category Group"
              size="lg"
              helperText="(Clothing & Accessories, Electronics, Vehicle, Others)"
              {...register("category_group")}
              invalid={errors.category_group ? true : false}
              invalidText={errors.category_group?.message}
            >
              {categoryGroups?.category_groups.map((group) => (
                <SelectItem key={group.id} text={group.name} value={group.id} />
              ))}
            </Select>
          )}

          {loadingCategoryStatuses ? (
            <SelectSkeleton />
          ) : (
            <Select
              id="status"
              labelText="Status"
              size="lg"
              helperText="(Active, Inactive, Draft)"
              {...register("status")}
              invalid={errors.status ? true : false}
              invalidText={errors.status?.message}
            >
              {categoryStatuses?.category_statuses.map((status) => (
                <SelectItem
                  key={status.id}
                  text={status.name}
                  value={status.id}
                />
              ))}
            </Select>
          )}
        </Form>
      </Modal>

      <Modal
        open={dangerModalOpen}
        aria-label="Delete category"
        modalLabel="Category resources"
        modalHeading="Are you sure you want to delete this category?"
        danger
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
        size="md"
        onRequestClose={handleDeleteModal}
        loadingStatus={deleteStatus}
        loadingDescription="Deleting..."
        onRequestSubmit={handleDelete}
      >
        <p>
          Check for dependencies on the products before deletion. For instance,
          if a product is assigned to this category, those products will need to
          be removed or reconfigured first.
        </p>
      </Modal>

      <Modal
        open={statusModal}
        aria-label="Update status"
        modalLabel="Category resources"
        modalHeading="Are you sure you want to update this category status?"
        primaryButtonText="Save"
        secondaryButtonText="Cancel"
        size="md"
        onRequestClose={handleStatusModal}
        loadingStatus={changeStatusPending}
        loadingDescription="Updating..."
        onRequestSubmit={handleChangeStatus}
      >
        <p>Are you sure you want to change the status of this category?</p>
      </Modal>

      {loadingPaginateCategories ? (
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
          className="p-0! [&>div:first-child]:[&>h2:first-child]:text-5xl! [&>div:first-child]:[&>h2:first-child]:pb-2!"
        >
          <TableToolbar>
            <TableToolbarContent>
              <TableToolbarSearch />
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
              <Button renderIcon={Add} onClick={handleModal}>
                Add Category
              </Button>
            </TableToolbarContent>
          </TableToolbar>
          {isEmpty ? (
            <div className="flex flex-col items-start justify-center py-16 gap-4 ps-5! pt-5!">
              <h3 className="text-xl font-semibold">No categories yet</h3>
              <p className="text-gray-500 max-w-md">
                Categories help organize your products. Create your first
                category to get started.
              </p>
              <Button renderIcon={Add} onClick={handleModal}>
                Add Category
              </Button>
            </div>
          ) : (
            <>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>Category Name</TableHeader>
                    <TableHeader>Category Status</TableHeader>
                    <TableHeader>Actions</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginateCategories?.categories.items.map((items, index) => (
                    <TableRow key={index}>
                      <TableCell>{items.name}</TableCell>
                      <TableCell>
                        <CarbonLink as={Link} href="#">
                          {
                            CategoryStatusConst[
                              items.status as keyof typeof CategoryStatusConst
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
                            onClick={() => {
                              setSelectedCategory(items.id);

                              form.reset({
                                name: items.name,
                                category_group: items.category_group.toString(),
                                status: items.status.toString(),
                              });

                              setOpen(true);
                            }}
                          />
                          <OverflowMenuItem
                            hasDivider
                            itemText="Set Active"
                            disabled={items.status === 1}
                            onClick={() => {
                              setSelectedCategory(items.id);
                              setStatusValue(1);
                              handleStatusModal();
                            }}
                          />
                          <OverflowMenuItem
                            itemText="Set Inactive"
                            disabled={items.status === 2}
                            onClick={() => {
                              setSelectedCategory(items.id);
                              setStatusValue(2);
                              handleStatusModal();
                            }}
                          />
                          <OverflowMenuItem
                            disabled={items.status === 3}
                            itemText="Set Draft"
                            onClick={() => {
                              setSelectedCategory(items.id);
                              setStatusValue(3);
                              handleStatusModal();
                            }}
                          />
                          <OverflowMenuItem
                            hasDivider
                            itemText="Delete"
                            isDelete
                            onClick={() => {
                              setSelectedCategory(items.id);

                              handleDeleteModal();
                            }}
                          />
                        </OverflowMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination
                backwardText="Previous page"
                forwardText="Next page"
                itemsPerPageText="Items per page:"
                page={page}
                pageSize={pageSize}
                pageSizes={[10, 20, 30, 40, 50]}
                totalItems={paginateCategories?.categories.total || 0} // Ensure your API returns the total count
                onChange={({ page, pageSize }) => {
                  setPage(page);
                  setPageSize(pageSize);
                }}
              />
            </>
          )}
        </TableContainer>
      )}
    </section>
  );
};
