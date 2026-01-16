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
import { useState, useRef, useEffect } from "react";
import {
  CreateUserModal,
  UpdateUserModal,
  DeleteUserModal,
} from "./components";
import { useDebounce } from "@/app/hooks/useDebounce";

export const Users = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

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

  const { data: paginateUser, isPending: loadingPaginateUsers } =
    useGetPaginateUser({ page, limit: pageSize });

  // Mark as loaded once we have data
  useEffect(() => {
    if (paginateUser && !hasLoadedDataRef.current) {
      hasLoadedDataRef.current = true;
    }
  }, [paginateUser]);

  const isEmpty = paginateUser?.users.total === 0;
  const hasSearch = debouncedSearch && debouncedSearch.trim() !== "";
  const isEmptyWithSearch = isEmpty && hasSearch;

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
  const selectedUser =
    paginateUser?.users.items.find((u) => u.id === selectedUserId) || null;

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

      {loadingPaginateUsers && !hasLoadedDataRef.current ? (
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
              <TableToolbarSearch
                value={search}
                onChange={(_, value) => setSearch(value || "")}
              />
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
              {isEmpty ? (
                <TableRow>
                  <TableCell colSpan={4}>
                    <div className="flex flex-col items-start justify-center gap-4 ps-5! py-5!">
                      {isEmptyWithSearch ? (
                        <>
                          <h3 className="text-xl font-semibold">
                            No results found
                          </h3>
                          <p className="text-gray-500 max-w-md">
                            No users match your search for "{debouncedSearch}".
                            Try adjusting your search terms or clear the search
                            to see all users.
                          </p>
                          <Button
                            kind="ghost"
                            onClick={() => setSearch("")}
                          >
                            Clear search
                          </Button>
                        </>
                      ) : (
                        <>
                          <h3 className="text-xl font-semibold">
                            No Users yet
                          </h3>
                          <p className="text-gray-500 max-w-md">
                            Create your first user.
                          </p>
                          <Button onClick={handleOpen} renderIcon={Add}>
                            Add User
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginateUser?.users.items.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      {user.first_name} {user.last_name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="capitalize">
                      {user.role?.name || "N/A"}
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
            totalItems={paginateUser?.users.total || 0}
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
