"use client";
import { Add, Information, OverflowMenuHorizontal } from "@carbon/icons-react";
import {
  Button,
  DataTableSkeleton,
  Form,
  Modal,
  OverflowMenu,
  OverflowMenuItem,
  Pagination,
  PasswordInput,
  Select,
  SelectItem,
  SelectSkeleton,
  Tab,
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
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  TextInput,
  Toggletip,
  ToggletipButton,
  ToggletipContent,
} from "@carbon/react";
import {
  useChangePassword,
  useCreateUser,
  useDeleteUser,
  useGetPaginateUser,
  useUpdateUser,
} from "./hooks/useIam";
import { useState } from "react";
import { useGetRoles } from "../roles";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateUserSchema,
  createUserSchema,
  updateUserPassword,
  UpdateUserPasswordSchema,
  UpdateUserSchema,
  updateUserSchema,
} from "@/app/types";
import { useQueryClient } from "@tanstack/react-query";
import { useModalLoading } from "@/app/hooks";

export const Users = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [open, setOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const { data: getRoles, isPending: loadingRoles } = useGetRoles();
  const { data: paginateUser, isPending: loadingPaginateUsers } =
    useGetPaginateUser({ page, limit: pageSize });
  const {
    mutateAsync: CreateUser,
    isPending: Creating,
    isError: CreateError,
    isSuccess: CreateSuccess,
    reset: CreateReset,
  } = useCreateUser();
  const {
    mutateAsync: UpdateUser,
    isPending: Updating,
    isError: UpdateError,
    isSuccess: UpdateSuccess,
    reset: UpdateReset,
  } = useUpdateUser();
  const {
    mutateAsync: ChangePassword,
    isPending: PasswordPending,
    isError: PasswordError,
    isSuccess: PasswordSuccess,
    reset: PasswordReset,
  } = useChangePassword();
  const {
    mutateAsync: DeleteUser,
    isPending: Deleting,
    isError: DeleteError,
    isSuccess: DeleteSuccess,
    reset: DeleteReset,
  } = useDeleteUser();

  const { status: CreateOrUpdateStatus } = useModalLoading({
    loading: Creating || Updating || PasswordPending || Deleting,
    success: CreateSuccess || UpdateSuccess || PasswordSuccess || DeleteSuccess,
    error: CreateError || UpdateError || PasswordError || DeleteError,
  });

  const resetMutations = () => {
    if (!Creating) {
      CreateReset();
    }

    if (!Updating) {
      UpdateReset();
    }

    if (!PasswordPending) {
      PasswordReset();
    }

    if (!Deleting) {
      DeleteReset();
    }
  };

  const isEmpty = paginateUser?.users.total === 0;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({ resolver: zodResolver(createUserSchema), mode: "onSubmit" });

  const {
    register: updateRegister,
    handleSubmit: submitUpdate,
    formState: { errors: errorsUpdate },
    reset: resetUpdate,
    setError: setErrorUpdate,
  } = useForm({
    resolver: zodResolver(updateUserSchema),
    mode: "onSubmit",
  });

  const {
    register: passRegister,
    handleSubmit: submitPass,
    formState: { errors: passError },
    reset: resetPass,
    setError: setErrorPass,
  } = useForm({
    resolver: zodResolver(updateUserPassword),
    mode: "onSubmit",
  });

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const disclosureUpdate = (id?: number) => {
    if (openUpdate) {
      setSelectedUser(null);
      setSelectedTab(0);
    }

    if (id) {
      const user = paginateUser?.users.items.find((user) => user.id === id);

      if (user) {
        resetUpdate({
          first_name: user?.first_name,
          last_name: user?.last_name,
          email: user?.email,
          role: String(user?.role.id),
        });
      }
      setSelectedUser(id);
    } else {
      setSelectedUser(null);
    }

    setOpenUpdate((prev) => !prev);
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

          resetMutations();
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
          resetMutations();
        }, 2000);
      },
    });
  };

  const handleUpdatePayload = (payload: UpdateUserSchema) => {
    if (selectedUser) {
      UpdateUser(
        { id: selectedUser, payload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["paginate-users"],
            });
            setTimeout(() => {
              resetUpdate({
                first_name: "",
                last_name: "",
                email: "",
                role: "",
              });

              resetMutations();
              disclosureUpdate();
            }, 500);
          },

          onError: (error) => {
            if (error.errors) {
              const serverErrors = error.errors;
              Object.entries(serverErrors).forEach(([field, message]) => {
                setErrorUpdate(field as keyof UpdateUserSchema, {
                  type: "server",
                  message: message as string,
                });
              });
            }

            setTimeout(() => {
              UpdateReset();
              resetMutations();
            }, 2000);
          },
        },
      );
    }
  };

  const handleChangePassword = (payload: UpdateUserPasswordSchema) => {
    if (!selectedUser) return;

    ChangePassword(
      {
        id: selectedUser,
        payload: payload,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["paginate-users"],
          });
          setTimeout(() => {
            resetPass({
              old_password: "",
              new_password: "",
              confirm_password: "",
            });

            resetMutations();
            disclosureUpdate();
          }, 500);
        },
        onError: (error) => {
          if (!error?.errors) return;
          const serverErrors = error.errors;
          Object.entries(serverErrors).forEach(([field, message]) => {
            setErrorPass(field as keyof UpdateUserPasswordSchema, {
              type: "server",
              message: message as string,
            });
          });

          setTimeout(() => {
            PasswordReset();
            resetMutations();
          }, 2000);
        },
      },
    );
  };

  const handleOpenDelete = (id?: number) => {
    if (openDelete) setSelectedUser(null);
    if (id) {
      setSelectedUser(id);
    }

    setOpenDelete((prev) => !prev);
  };

  const handleDelete = () => {
    if (!selectedUser) return;

    DeleteUser(selectedUser, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["paginate-users"],
        });

        setTimeout(() => {
          resetMutations();
          handleOpenDelete();
        }, 500);
      },
    });
  };

  const submitUpdates =
    selectedTab == 0
      ? submitUpdate(handleUpdatePayload)
      : submitPass(handleChangePassword);

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
              className="capitalize!"
              invalid={!!errors.role}
              invalidText={errors.role?.message}
            >
              {getRoles?.roles.items.map((role) => (
                <SelectItem
                  className="capitalize"
                  key={role.id}
                  value={role.id}
                  text={role.name}
                />
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

      <Modal
        modalLabel="User resources"
        modalHeading="Update User Detail"
        primaryButtonText="Save changes"
        secondaryButtonText="Cancel"
        open={openUpdate}
        onRequestClose={() => disclosureUpdate()}
        shouldSubmitOnEnter
        onRequestSubmit={submitUpdates}
        loadingDescription="Updating user"
        loadingStatus={CreateOrUpdateStatus}
        id="update"
      >
        <Tabs
          selectedIndex={selectedTab}
          onChange={(value) => setSelectedTab(value.selectedIndex)}
        >
          <TabList>
            <Tab>User Details</Tab>
            <Tab>Change Password</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <div className="flex flex-col gap-5 pt-5!">
                <TextInput
                  id="update_fname"
                  labelText={
                    <span className="flex items-center gap-1">
                      First Name
                      <span className="text-red-500">*</span>
                    </span>
                  }
                  placeholder="Enter first name"
                  required
                  {...updateRegister("first_name")}
                  invalid={!!errorsUpdate.first_name}
                  invalidText={errorsUpdate.first_name?.message}
                />
                <TextInput
                  id="update_lname"
                  labelText={
                    <span className="flex items-center gap-1">
                      Last Name
                      <span className="text-red-500">*</span>
                    </span>
                  }
                  placeholder="Enter last name"
                  required
                  {...updateRegister("last_name")}
                  invalid={!!errorsUpdate.last_name}
                  invalidText={errorsUpdate.last_name?.message}
                />
                <TextInput
                  id="update_email"
                  labelText={
                    <span className="flex items-center gap-1">
                      Email
                      <span className="text-red-500">*</span>
                    </span>
                  }
                  placeholder="Enter email"
                  required
                  type="email"
                  {...updateRegister("email")}
                  invalid={!!errorsUpdate.email}
                  invalidText={errorsUpdate.email?.message}
                />

                {loadingRoles || getRoles?.roles.total === 0 ? (
                  <SelectSkeleton />
                ) : (
                  <Select
                    id="role_update"
                    labelText={
                      <span className="flex items-center gap-1">
                        Role
                        <span className="text-red-500">*</span>
                      </span>
                    }
                    {...updateRegister("role")}
                    className="capitalize!"
                    invalid={!!errorsUpdate.role}
                    invalidText={errorsUpdate.role?.message}
                  >
                    {getRoles?.roles.items.map((role) => (
                      <SelectItem
                        className="capitalize"
                        key={role.id}
                        value={role.id}
                        text={role.name}
                      />
                    ))}
                  </Select>
                )}
              </div>
            </TabPanel>
            <TabPanel>
              <div className="flex flex-col gap-5">
                <PasswordInput
                  id="old_password"
                  labelText={
                    <span className="flex items-center gap-1">
                      Old Password
                      <Toggletip>
                        <ToggletipButton label="Show Information">
                          <Information />
                        </ToggletipButton>
                        <ToggletipContent>
                          <p>Enter your current password.</p>
                        </ToggletipContent>
                      </Toggletip>
                    </span>
                  }
                  size="md"
                  placeholder="Create password"
                  required
                  {...passRegister("old_password")}
                  invalid={!!passError.old_password}
                  invalidText={passError.old_password?.message}
                />

                <PasswordInput
                  id="new_password"
                  labelText={
                    <span className="flex items-center gap-1">
                      New Password
                      <Toggletip>
                        <ToggletipButton label="Show Information">
                          <Information />
                        </ToggletipButton>
                        <ToggletipContent>
                          <p>Create your new password.</p>
                        </ToggletipContent>
                      </Toggletip>
                    </span>
                  }
                  size="md"
                  placeholder="Create password"
                  required
                  {...passRegister("new_password")}
                  invalid={!!passError.new_password}
                  invalidText={passError.new_password?.message}
                />

                <PasswordInput
                  id="change_confirm_password"
                  labelText={
                    <span className="flex items-center gap-1">
                      Confirm Password
                      <Toggletip>
                        <ToggletipButton label="Show Information">
                          <Information />
                        </ToggletipButton>
                        <ToggletipContent>
                          <p>Re-enter your new password.</p>
                        </ToggletipContent>
                      </Toggletip>
                    </span>
                  }
                  size="md"
                  placeholder="Create password"
                  required
                  {...passRegister("confirm_password")}
                  invalid={!!passError.confirm_password}
                  invalidText={passError.confirm_password?.message}
                />
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Modal>

      <Modal
        open={openDelete}
        aria-label="Delete User"
        modalLabel="User resources"
        modalHeading="Are you sure you want to delete this user?"
        danger
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
        size="md"
        onRequestClose={() => handleOpenDelete()}
        loadingStatus={CreateOrUpdateStatus}
        loadingDescription="Deleting..."
        onRequestSubmit={handleDelete}
      >
        <p>
          Check for dependencies on the user before deletion. For instance, if a
          user has products assigned to them, those products will be removed.
        </p>
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
            <>
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
                          <OverflowMenuItem
                            onClick={() => disclosureUpdate(user.id)}
                            itemText="Edit"
                          />
                          <OverflowMenuItem
                            itemText="Delete"
                            onClick={() => {
                              handleOpenDelete(user.id);
                            }}
                            isDelete
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
                totalItems={paginateUser?.users.total || 0} // Ensure your API returns the total count
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
