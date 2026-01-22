"use client";

import { Button, ClickableTile, Column, Grid, Tile } from "@carbon/react";
import {
  ArrowRight,
  Category,
  GroupAccess,
  Product,
  VehicleApi,
} from "@carbon/icons-react";
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
              <ClickableTile className="h-40 " renderIcon={ArrowRight}>
                <div className="flex items-start justify-between mb-4!">
                  <div>
                    <h3 className="text-sm font-medium  mb-1!">{stat.title}</h3>
                    <p className="text-3xl font-semibold">{stat.value}</p>
                  </div>
                  <div className="">
                    <Icon size={32} />
                  </div>
                </div>
              </ClickableTile>
            </Column>
          );
        })}
      </Grid>

      <div className="mt-8!">
        <h2 className="text-xl font-semibold mb-4!">Quick Actions</h2>

        <div className="grid grid-cols-6 gap-0.5">
          <ClickableTile className="col-span-4 row-span-4 h-96">
            <h3 className="text-sm">Users</h3>
          </ClickableTile>
          <ClickableTile className="col-span-2 row-span-2">
            <h3 className="text-sm">Categories</h3>
          </ClickableTile>
          <ClickableTile className="col-span-2 row-span-2">
            <h3 className="text-sm">Vehicles</h3>
          </ClickableTile>
        </div>
      </div>
    </div>
  );
};
