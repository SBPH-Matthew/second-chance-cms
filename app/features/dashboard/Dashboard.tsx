"use client";

import { ClickableTile, Column, Tile } from "@carbon/react";
import {
  ArrowRight,
  Category,
  GroupAccess,
  Product,
  VehicleApi,
} from "@carbon/icons-react";
import { useRouter } from "next/navigation";
import { useGetPaginateUser } from "../iam/hooks/useIam";
import { usePaginateCategories } from "../category/hooks";
import { usePaginateProducts } from "../product/hooks";
import { usePaginateVehicles } from "../vehicle/hooks";

export const Dashboard = () => {
  const router = useRouter();
  const { data: usersData } = useGetPaginateUser({ page: 1, limit: 1 });
  const { data: categoriesData } = usePaginateCategories({ page: 1, limit: 1 });
  const { data: productsData } = usePaginateProducts({ page: 1, limit: 1 });
  const { data: vehiclesData } = usePaginateVehicles({
    page: 1,
    limit: 1,
    search: undefined,
  });

  const handleNavigate = (url: string) => {
    router.push(url);
  };

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

      <div className="p-0! grid grid-cols-4 gap-2">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isUserCard = stat.title === "Total Users";
          return (
            <Column key={stat.title} lg={4} md={4} sm={4}>
              <Tile
                className="h-40"
                style={
                  isUserCard
                    ? {
                        background: "linear-gradient(134deg, #012c9c, #5c4bd2)",
                        color: "white",
                      }
                    : undefined
                }
              >
                <div className="flex items-start justify-between mb-4!">
                  <div>
                    <h3
                      className={`text-sm font-medium mb-1! ${
                        isUserCard ? "text-white!" : ""
                      }`}
                    >
                      {stat.title}
                    </h3>
                    <p
                      className={`text-3xl font-semibold ${
                        isUserCard ? "text-white!" : ""
                      }`}
                    >
                      {stat.value}
                    </p>
                  </div>
                  <div className={isUserCard ? "text-white!" : ""}>
                    <Icon size={32} />
                  </div>
                </div>
              </Tile>
            </Column>
          );
        })}
      </div>

      <div className="mt-8!">
        <h2 className="text-xl font-semibold mb-4!">Quick Actions</h2>

        <div className="grid grid-cols-6 gap-0.5">
          <ClickableTile
            className="col-span-4 row-span-4 h-96"
            renderIcon={ArrowRight}
            onClick={() => handleNavigate("/dashboard/user")}
          >
            <h3 className="text-sm text-white!">Users</h3>
            <p className="text-xs text-white! mt-2! opacity-80">
              Manage user accounts, roles, and permissions. View, create, edit,
              and delete users in the system.
            </p>
          </ClickableTile>
          <ClickableTile
            className="col-span-2 row-span-2"
            renderIcon={ArrowRight}
            onClick={() => handleNavigate("/dashboard/product")}
          >
            <h3 className="text-sm text-white!">Products</h3>
            <p className="text-xs text-white! mt-2! opacity-80">
              Manage product inventory, categories, and listings.
            </p>
          </ClickableTile>
          <ClickableTile
            className="col-span-2 row-span-2"
            renderIcon={ArrowRight}
            onClick={() => handleNavigate("/dashboard/vehicle")}
          >
            <h3 className="text-sm text-white!">Vehicles</h3>
            <p className="text-xs text-white! mt-2! opacity-80">
              Manage vehicle listings and inventory.
            </p>
          </ClickableTile>
        </div>
      </div>
    </div>
  );
};
