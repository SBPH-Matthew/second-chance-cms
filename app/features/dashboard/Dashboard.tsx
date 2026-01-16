"use client";

import { Button, Column, Grid, Tile } from "@carbon/react";
import {
  Category,
  GroupAccess,
  Product,
  VehicleApi,
} from "@carbon/icons-react";
import Link from "next/link";
import { useGetPaginateUser } from "../iam/hooks/useIam";
import { usePaginateCategories } from "../category/hooks";
import { usePaginateProducts } from "../product/hooks";
import { usePaginateVehicles } from "../vehicle/hooks";

export const Dashboard = () => {
  const { data: usersData } = useGetPaginateUser({ page: 1, limit: 1 });
  const { data: categoriesData } = usePaginateCategories({ page: 1, limit: 1 });
  const { data: productsData } = usePaginateProducts({ page: 1, limit: 1 });
  const { data: vehiclesData } = usePaginateVehicles({
    page: 1,
    limit: 1,
    search: undefined,
  });

  const stats = [
    {
      title: "Total Users",
      value: usersData?.users.total || 0,
      icon: GroupAccess,
      href: "/user",
      color: "blue",
    },
    {
      title: "Total Categories",
      value: categoriesData?.categories.total || 0,
      icon: Category,
      href: "/category",
      color: "green",
    },
    {
      title: "Total Products",
      value: productsData?.products.total || 0,
      icon: Product,
      href: "/product",
      color: "purple",
    },
    {
      title: "Total Vehicles",
      value: vehiclesData?.vehicles.total || 0,
      icon: VehicleApi,
      href: "/vehicle",
      color: "teal",
    },
  ];

  return (
    <div className="p-6!">
      <div className="mb-6!">
        <h1 className="text-3xl font-semibold mb-2">Dashboard</h1>
        <p className="text-gray-500">
          Welcome to your Second Chance CMS dashboard
        </p>
      </div>

      <Grid fullWidth>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Column key={stat.title} lg={4} md={4} sm={4}>
              <Tile className="h-full">
                <div className="flex items-start justify-between mb-4!">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1!">
                      {stat.title}
                    </h3>
                    <p className="text-3xl font-semibold">{stat.value}</p>
                  </div>
                  <div className="text-blue-500">
                    <Icon size={32} />
                  </div>
                </div>
                <Button
                  kind="ghost"
                  size="sm"
                  as={Link}
                  href={stat.href}
                  className="mt-2"
                >
                  View all →
                </Button>
              </Tile>
            </Column>
          );
        })}
      </Grid>

      <div className="mt-8!">
        <h2 className="text-xl font-semibold mb-4!">Quick Actions</h2>
        <Grid fullWidth>
          <Column lg={3} md={4} sm={4}>
            <Tile>
              <h3 className="text-lg font-semibold mb-2!">Categories</h3>
              <p className="text-sm text-gray-500 mb-4!">
                Manage your product categories
              </p>
              <Button as={Link} href="/category" kind="primary">
                Manage Categories
              </Button>
            </Tile>
          </Column>
          <Column lg={3} md={4} sm={4}>
            <Tile>
              <h3 className="text-lg font-semibold mb-2">Products</h3>
              <p className="text-sm text-gray-500 mb-4">
                Add and manage products
              </p>
              <Button as={Link} href="/product" kind="primary">
                Manage Products
              </Button>
            </Tile>
          </Column>
          <Column lg={3} md={4} sm={4}>
            <Tile>
              <h3 className="text-lg font-semibold mb-2">Vehicles</h3>
              <p className="text-sm text-gray-500 mb-4">
                Manage vehicle inventory
              </p>
              <Button as={Link} href="/vehicle" kind="primary">
                Manage Vehicles
              </Button>
            </Tile>
          </Column>
          <Column lg={3} md={4} sm={4}>
            <Tile>
              <h3 className="text-lg font-semibold mb-2">Users</h3>
              <p className="text-sm text-gray-500 mb-4">Manage user accounts</p>
              <Button as={Link} href="/user" kind="primary">
                Manage Users
              </Button>
            </Tile>
          </Column>
        </Grid>
      </div>
    </div>
  );
};
