"use client";
import { Add, OverflowMenuHorizontal } from "@carbon/icons-react";
import {
  Button,
  DataTableSkeleton,
  Form,
  Modal,
  OverflowMenu,
  OverflowMenuItem,
  PasswordInput,
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
import { useCreateUser, useGetPaginateUser } from "./hooks/useIam";
import { useState } from "react";
import { useGetRoles } from "../roles";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateUserSchema, createUserSchema } from "@/app/types";
import { useQueryClient } from "@tanstack/react-query";
import { useModalLoading } from "@/app/hooks";

export const Users = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [open, setOpen] = useState(false);
  const { data: getRoles, isPending: loadingRoles } = useGetRoles();
  const { data: paginateUser, isPending: loadingPaginateUsers } =
    useGetPaginateUser({ page, limit });
  const {
    mutateAsync: CreateUser,
    isPending: Creating,
    isError: CreateError,
    isSuccess: CreateSuccess,
    reset: CreateReset,
  } = useCreateUser();

  const { status: CreateOrUpdateStatus } = useModalLoading({
    loading: Creating,
    success: CreateSuccess,
    error: CreateError,
  });

  const isEmpty = paginateUser?.users.total === 0;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({ resolver: zodResolver(createUserSchema), mode: "onSubmit" });

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const handlePayload = (payload: CreateUserSchema) => {
    CreateUser(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["paginate-users"],
        });
        setTimeout(() => {
          reset({
            first_name: "",
            last_name: "",
            email: "",
            role: "",
            confirm_password: "",
            password: "",
          });

          CreateReset();
          handleOpen();
        }, 500);
      },
      onError: (error) => {
        if (error.errors) {
          const serverErrors = error.errors;
          Object.entries(serverErrors).forEach(([field, message]) => {
            setError(field as keyof CreateUserSchema, {
              type: "server",
              message: message as string,
            });
          });
        }

        setTimeout(() => {
          CreateReset();
        }, 2000);
      },
    });
  };

  return (
    <section className="min-h-full!">
      <Modal
        open={open}
        modalLabel="User resources"
        modalHeading="Add User"
        onRequestClose={handleOpen}
        primaryButtonText="Add"
        secondaryButtonText="Cancel"
        size="sm"
        loadingStatus={CreateOrUpdateStatus}
        onRequestSubmit={handleSubmit(handlePayload)}
        shouldSubmitOnEnter
      >
        <Form className="flex flex-col gap-5">
          <TextInput
            id="first_name"
            labelText={
              <span className="flex items-center gap-1">
                First Name
                <span className="text-red-500">*</span>
              </span>
            }
            placeholder="Enter first name"
            required
            {...register("first_name")}
            invalid={!!errors.first_name}
            invalidText={errors.first_name?.message}
          />
          <TextInput
            id="last_name"
            labelText={
              <span className="flex items-center gap-1">
                Last Name
                <span className="text-red-500">*</span>
              </span>
            }
            placeholder="Enter last name"
            required
            {...register("last_name")}
            invalid={!!errors.last_name}
            invalidText={errors.last_name?.message}
          />
          <TextInput
            id="email"
            labelText={
              <span className="flex items-center gap-1">
                Email
                <span className="text-red-500">*</span>
              </span>
            }
            placeholder="Enter email"
            required
            {...register("email")}
            invalid={!!errors.email}
            invalidText={errors.email?.message}
          />

          {loadingRoles || getRoles?.roles.total === 0 ? (
            <SelectSkeleton />
          ) : (
            <Select
              id="role"
              labelText={
                <span className="flex items-center gap-1">
                  Role
                  <span className="text-red-500">*</span>
                </span>
              }
              {...register("role")}
              invalid={!!errors.role}
              invalidText={errors.role?.message}
            >
              {getRoles?.roles.items.map((role) => (
                <SelectItem key={role.id} value={role.id} text={role.name} />
              ))}
            </Select>
          )}
          <PasswordInput
            id="password"
            labelText={
              <span className="flex items-center gap-1">
                Password
                <span className="text-red-500">*</span>
              </span>
            }
            size="md"
            placeholder="Create password"
            required
            {...register("password")}
            invalid={!!errors.password}
            invalidText={errors.password?.message}
          />

          <PasswordInput
            id="confirm_password"
            labelText={
              <span className="flex items-center gap-1">
                Confirm Password
                <span className="text-red-500">*</span>
              </span>
            }
            size="md"
            placeholder="Confirm password"
            required
            {...register("confirm_password")}
            invalid={!!errors.confirm_password}
            invalidText={errors.confirm_password?.message}
          />
        </Form>
      </Modal>
      {loadingPaginateUsers ? (
        <DataTableSkeleton
          aria-label="User tables"
          headers={[
            { header: "Name", key: "name" },
            { header: "Email", key: "email" },
            { header: "Role", key: "role" },
            { header: "Actions", key: "actions" },
          ]}
          showHeader
          showToolbar
          columnCount={4}
        />
      ) : (
        <TableContainer
          title="User Table"
          description="Manage your users"
          className="p-0! [&>div:first-child]:[&>h2:first-child]:text-5xl! [&>div:first-child]:[&>h2:first-child]:pb-2!"
        >
          <TableToolbar>
            <TableToolbarContent>
              <TableToolbarSearch />
              <TableToolbarMenu>
                <TableToolbarAction onClick={() => console.log("hello")}>
                  Action 1
                </TableToolbarAction>
              </TableToolbarMenu>
              <Button onClick={handleOpen} renderIcon={Add}>
                Add User
              </Button>
            </TableToolbarContent>
          </TableToolbar>
          {isEmpty ? (
            <div className="flex flex-col items-start justify-center py-16 gap-4 ps-5! pt-5!">
              <h3 className="text-xl font-semibold">No Users yet</h3>
              <p className="text-gray-500 max-w-md">Create your first user.</p>
              <Button renderIcon={Add}>Add Category</Button>
            </div>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>Email</TableHeader>
                  <TableHeader>Role</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginateUser?.users.items.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      {user.first_name} {user.last_name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="capitalize">
                      {user.role.name}
                    </TableCell>
                    <TableCell>
                      <OverflowMenu
                        aria-label="actions"
                        renderIcon={OverflowMenuHorizontal}
                        flipped
                      >
                        <OverflowMenuItem itemText="Edit" />
                        <OverflowMenuItem itemText="Delete" isDelete />
                      </OverflowMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      )}
    </section>
  );
};
