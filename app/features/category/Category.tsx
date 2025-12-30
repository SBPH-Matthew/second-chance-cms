"use client";
import { Add, OverflowMenuHorizontal } from "@carbon/icons-react";
import {
  Button,
  DataTableSkeleton,
  Form,
  Modal,
  OverflowMenu,
  OverflowMenuItem,
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
  ServerValidationErrors,
} from "@/app/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateCategory,
  useGetCategoryGroups,
  useGetCategoryStatuses,
  usePaginateCategories,
  useUpdateCategory,
} from "./hooks";
import { useModalLoading } from "@/app/hooks";
import { CarbonLink } from "@/app/components";
import Link from "next/link";
import { CategoryStatusConst } from "@/app/constants";
import { useQueryClient } from "@tanstack/react-query";

export const Category = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const { data: categoryGroups, isPending: loadingCategoryGroups } =
    useGetCategoryGroups();
  const { data: categoryStatuses, isPending: loadingCategoryStatuses } =
    useGetCategoryStatuses();
  const { data: paginateCategories, isPending: loadingPaginateCategories } =
    usePaginateCategories({
      page: 1,
      limit: 10,
    });

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

  // 2. Combine them for the hook
  const { status } = useModalLoading({
    loading: isCreating || isUpdating,
    success: createSuccess || updateSuccess,
    error: createError || updateError,
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
          // 1. Reset the form fields
          form.reset({ name: "", category_group: "", status: "" });
          // 2. Clear the ID and close modal
          handleModal();
          // 3. Reset the mutation states (important for useModalLoading)
          resetCreate();
          resetUpdate();
          queryClient.invalidateQueries({
            queryKey: ["paginate-categories"],
          });
        }, 500);
      })
      .catch((error: any) => {
        if (error?.errors) {
          const serverErrors = error?.errors as ServerValidationErrors;
          Object.entries(serverErrors).forEach(([field, message]) => {
            setError(field as keyof CreateCategoryRequest, {
              type: "server",
              message: message,
            });
          });
        }
      });
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
                      <OverflowMenuItem hasDivider itemText="Set Active" />
                      <OverflowMenuItem itemText="Set Inactive" />
                      <OverflowMenuItem itemText="Set Draft" />
                      <OverflowMenuItem hasDivider itemText="Delete" isDelete />
                    </OverflowMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </section>
  );
};
