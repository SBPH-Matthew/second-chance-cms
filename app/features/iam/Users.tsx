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
import { useGetPaginateUser } from "./hooks/useIam";
import { useState } from "react";
import { CreateUserModal, UpdateUserModal, DeleteUserModal } from "./components";

export const Users = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const { data: paginateUser, isPending: loadingPaginateUsers } =
    useGetPaginateUser({ page, limit: pageSize });

  const isEmpty = paginateUser?.users.total === 0;

  const handleOpen = () => setOpen((prev) => !prev);

  const handleOpenUpdate = (id?: number) => {
    if (id) setSelectedUserId(id);
    setOpenUpdate((prev) => !prev);
    if (!id && openUpdate) setSelectedUserId(null);
  };

  const handleOpenDelete = (id?: number) => {
    if (id) setSelectedUserId(id);
    setOpenDelete((prev) => !prev);
    if (!id && openDelete) setSelectedUserId(null);
  };

  // Find the selected user object from the paginated list
  const selectedUser = paginateUser?.users.items.find(u => u.id === selectedUserId) || null;

  return (
    <section className="min-h-full!">
      <CreateUserModal open={open} onClose={() => setOpen(false)} />

      <UpdateUserModal
        open={openUpdate}
        onClose={() => {
          setOpenUpdate(false);
          setSelectedUserId(null);
        }}
        user={selectedUser}
      />

      <DeleteUserModal
        open={openDelete}
        onClose={() => {
          setOpenDelete(false);
          setSelectedUserId(null);
        }}
        id={selectedUserId}
      />

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
          className="p-0!"
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
              <Button onClick={handleOpen} renderIcon={Add}>
                Add User
              </Button>
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
                            onClick={() => handleOpenUpdate(user.id)}
                            itemText="Edit"
                          />
                          <OverflowMenuItem
                            itemText="Delete"
                            onClick={() => handleOpenDelete(user.id)}
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
                totalItems={paginateUser?.users.total || 0}
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
