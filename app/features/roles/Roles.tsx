"use client";

import { OverflowMenuHorizontal } from "@carbon/icons-react";
import {
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
import { useGetRoles } from "./hooks";

export const Roles = () => {
  const { data: rolesData, isPending: loadingRoles } = useGetRoles();

  // Map the API response to handle both camelCase and PascalCase
  const roles = (rolesData?.roles.items || []).map((role: any) => ({
    id: role.id || role.ID?.toString() || "",
    name: role.name || role.Name || "",
  }));

  const isEmpty = roles.length === 0;

  return (
    <section>
      {loadingRoles ? (
        <DataTableSkeleton
          aria-label="Roles table"
          headers={[
            { header: "Role Name", key: "name" },
            { header: "Actions", key: "action" },
          ]}
          showHeader
          showToolbar
          columnCount={2}
        />
      ) : (
        <TableContainer
          title="Roles"
          description="View system roles"
          className="p-0!"
        >
          <TableToolbar>
            <TableToolbarContent>
              <TableToolbarSearch />
            </TableToolbarContent>
          </TableToolbar>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Role Name</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {isEmpty ? (
                <TableRow>
                  <TableCell colSpan={2}>
                    <div className="flex flex-col items-start justify-center gap-4 ps-5! py-5!">
                      <h3 className="text-xl font-semibold">No roles found</h3>
                      <p className="text-gray-500 max-w-md">
                        Roles define user permissions and access levels in the
                        system.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>{role.name}</TableCell>
                    <TableCell>
                      <OverflowMenu
                        aria-label="actions"
                        renderIcon={OverflowMenuHorizontal}
                        flipped
                      >
                        <OverflowMenuItem
                          itemText="View Details"
                          disabled
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
