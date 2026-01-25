"use client";
import { Add, OverflowMenuHorizontal, User } from "@carbon/icons-react";
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
import { SendMessageModal } from "../message/components/SendMessageModal";
import { useDebounce } from "@/app/hooks/useDebounce";

export const Users = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openMessage, setOpenMessage] = useState(false);
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

  const handleOpenMessage = (id?: number) => {
    if (id) setSelectedUserId(id);
    setOpenMessage((prev) => !prev);
    if (!id && openMessage) setSelectedUserId(null);
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

      <SendMessageModal
        open={openMessage}
        onClose={() => {
          setOpenMessage(false);
          setSelectedUserId(null);
        }}
        recipient={selectedUser}
      />

      {loadingPaginateUsers && !hasLoadedDataRef.current ? (
        <DataTableSkeleton
          aria-label="User tables"
          headers={[
            { header: "Avatar", key: "avatar" },
            { header: "Name", key: "name" },
            { header: "Email", key: "email" },
            { header: "Role", key: "role" },
            { header: "Rating", key: "rating" },
            { header: "Reviews", key: "total_reviews" },
            { header: "Actions", key: "actions" },
          ]}
          showHeader
          showToolbar
          columnCount={5}
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
                <TableHeader>Avatar</TableHeader>
                <TableHeader>Name</TableHeader>
                <TableHeader>Email</TableHeader>
                <TableHeader>Role</TableHeader>
                <TableHeader>Rating</TableHeader>
                <TableHeader>Reviews</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {isEmpty ? (
                <TableRow>
                  <TableCell colSpan={7}>
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
                paginateUser?.users.items.map((user) => {
                  const getImageUrl = (imagePath: string) => {
                    if (imagePath.startsWith('http')) {
                      return imagePath;
                    }
                    const apiUrl = process.env.NEXT_PUBLIC_API || '';
                    return `${apiUrl}${imagePath}`;
                  };

                  const getInitials = (firstName: string, lastName: string) => {
                    const first = firstName?.charAt(0)?.toUpperCase() || '';
                    const last = lastName?.charAt(0)?.toUpperCase() || '';
                    return `${first}${last}`;
                  };

                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        {user.profile_picture ? (
                          <img
                            src={getImageUrl(user.profile_picture)}
                            alt={`${user.first_name} ${user.last_name}`}
                            className="w-10 h-10 rounded-full object-cover border"
                            onError={(e) => {
                              // Fallback to User icon if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent && !parent.querySelector('.avatar-fallback')) {
                                const fallbackDiv = document.createElement('div');
                                fallbackDiv.className = 'avatar-fallback w-10 h-10 rounded-full bg-[#393939] flex items-center justify-center p-2';
                                const userIcon = document.createElement('div');
                                userIcon.innerHTML = '<svg width="20" height="20" viewBox="0 0 32 32" fill="currentColor"><path d="M16 8a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3z"/><path d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2zm0 26a12 12 0 0 1-10.29-5.79l5.71-5.71a2 2 0 0 1 2.83 0l5.71 5.71A12 12 0 0 1 16 28zm0-24a12 12 0 0 1 10.29 18.79l-5.71-5.71a2 2 0 0 0-2.83 0l-5.71 5.71A12 12 0 0 1 16 4z"/></svg>';
                                fallbackDiv.appendChild(userIcon);
                                parent.appendChild(fallbackDiv);
                              }
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#393939] flex items-center justify-center p-2">
                            <User size={20} />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.first_name} {user.last_name}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="capitalize">
                        {user.role?.name || "N/A"}
                      </TableCell>
                      <TableCell>{user.rating ?? 0}</TableCell>
                      <TableCell>{user.total_reviews ?? 0}</TableCell>
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
                            onClick={() => handleOpenMessage(user.id)}
                            itemText="Message"
                          />
                          <OverflowMenuItem
                            itemText="Delete"
                            onClick={() => handleOpenDelete(user.id)}
                            isDelete
                          />
                        </OverflowMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
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
