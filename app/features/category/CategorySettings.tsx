"use client";

import {
  Category,
  Settings,
  FolderDetails,
  Checkmark,
  ArrowRight,
} from "@carbon/icons-react";
import { Tile, Link, Theme } from "@carbon/react";
import { useRouter } from "next/navigation";

interface SettingsModule {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  href: string;
  color: string;
}

const modules: SettingsModule[] = [
  {
    id: "category-groups",
    title: "Category Groups",
    description:
      "Organize and manage category groups such as Clothing & Accessories, Electronics, Vehicles, and Others. Define the main classification structure for your product categories.",
    icon: FolderDetails,
    href: "/category/settings/groups",
    color: "blue",
  },
  {
    id: "category-status",
    title: "Category Status",
    description:
      "Configure category status options including Active, Inactive, and Draft. Control the lifecycle and visibility of categories in your system.",
    icon: Checkmark,
    href: "/category/settings/status",
    color: "purple",
  },
];

export const CategorySettings = () => {
  const router = useRouter();

  const handleModuleClick = (href: string) => {
    router.push(href);
  };

  return (
    <div className="min-h-screen p-6!">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col gap-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Category size={16} />
            <span>/</span>
            <Link
              href="/category"
              className="text-link-01 hover:text-link-01-hover"
            >
              Categories
            </Link>
            <span>/</span>
            <span className="text-text-primary">Settings</span>
          </div>

          {/* Modules Grid */}
          <div>
            <h2 className="text-heading-03 font-semibold mb-2">
              Configuration Modules
            </h2>
            <p className="text-body-01 text-text-secondary mb-6!">
              Select a module to configure category-related settings and
              options.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {modules.map((module) => {
                const IconComponent = module.icon;
                return (
                  <Tile
                    key={module.id}
                    className="h-full cursor-pointer hover:shadow-lg transition-all duration-200 border border-border-subtle-01 hover:border-border-strong-01 group"
                    onClick={() => handleModuleClick(module.href)}
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-3 rounded-lg transition-colors ${
                              module.color === "blue"
                                ? "bg-blue-10 group-hover:bg-blue-20"
                                : "bg-purple-10 group-hover:bg-purple-20"
                            }`}
                          >
                            <IconComponent
                              size={24}
                              className={
                                module.color === "blue"
                                  ? "text-blue-60"
                                  : "text-purple-60"
                              }
                            />
                          </div>
                          <div>
                            <h3 className="text-heading-03 font-semibold">
                              {module.title}
                            </h3>
                          </div>
                        </div>
                        <ArrowRight
                          size={20}
                          className="text-icon-secondary flex-shrink-0 mt-1 group-hover:text-icon-primary transition-colors"
                        />
                      </div>
                      <p className="text-body-01 text-text-secondary leading-relaxed">
                        {module.description}
                      </p>
                    </div>
                  </Tile>
                );
              })}
            </div>
          </div>

          {/* Additional Information Section */}
          <Tile className="bg-layer-01 border border-border-subtle-01">
            <div className="flex flex-col gap-3">
              <h2 className="text-heading-03 font-semibold">
                About Category Settings
              </h2>
              <p className="text-body-01 text-text-secondary leading-relaxed">
                Category settings allow you to configure the foundational
                elements of your category management system. Use these modules
                to define category groups, status options, and other
                classification settings that will be used throughout your
                product catalog.
              </p>
              <div className="mt-2">
                <Link
                  href="/category"
                  className="text-link-01 hover:text-link-01-hover text-sm inline-flex items-center gap-1"
                >
                  Return to Categories
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </Tile>
        </div>
      </div>
    </div>
  );
};
