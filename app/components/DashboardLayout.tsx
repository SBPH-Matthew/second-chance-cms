"use client";
import { ContentLayout } from "@/app/components";
import {
  Category as CaCategory,
  Fade,
  GroupAccess,
  Product,
  UserAccess,
} from "@carbon/icons-react";
import {
  Header,
  HeaderContainer,
  HeaderMenuButton,
  HeaderName,
  SideNav,
  SideNavItems,
  SideNavLink,
  SideNavMenu,
  SideNavMenuItem,
  SkipToContent,
  Theme,
} from "@carbon/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  return (
    <Theme theme="g100">
      <HeaderContainer
        render={({ isSideNavExpanded, onClickSideNavExpand }) => (
          <>
            <Header aria-label="IBM Platform Name">
              <SkipToContent />
              <HeaderMenuButton
                aria-label={isSideNavExpanded ? "Close menu" : "Open menu"}
                onClick={onClickSideNavExpand}
                isActive={isSideNavExpanded}
                aria-expanded={isSideNavExpanded}
              />
              <HeaderName href="#" prefix="IBM">
                [Platform]
              </HeaderName>
              <SideNav
                aria-label="Side navigation"
                expanded={isSideNavExpanded}
                onSideNavBlur={onClickSideNavExpand}
                href="#main-content"
              >
                <SideNavItems>
                  <SideNavMenu renderIcon={CaCategory} title="Category" large>
                    <SideNavMenuItem
                      as={Link}
                      href="/category"
                      isActive={pathname === "/category"}
                    >
                      Manage Categories
                    </SideNavMenuItem>
                    <SideNavMenuItem
                      as={Link}
                      href="/category/settings"
                      isActive={pathname === "/category/settings"}
                    >
                      Category Settings
                    </SideNavMenuItem>
                  </SideNavMenu>
                  <SideNavMenu renderIcon={GroupAccess} title="IAM" large>
                    <SideNavMenuItem href="https://www.carbondesignsystem.com/">
                      User
                    </SideNavMenuItem>
                    <SideNavMenuItem href="https://www.carbondesignsystem.com/">
                      Role
                    </SideNavMenuItem>
                    <SideNavMenuItem href="https://www.carbondesignsystem.com/">
                      Policy
                    </SideNavMenuItem>
                  </SideNavMenu>
                  <SideNavMenu renderIcon={Product} title="Products" large>
                    <SideNavMenuItem
                      as={Link}
                      href="/product"
                      isActive={pathname === "/product"}
                    >
                      Manage Products
                    </SideNavMenuItem>
                    <SideNavMenuItem
                      as={Link}
                      href="/product/settings"
                      isActive={pathname === "/product/settings"}
                    >
                      Product Settings
                    </SideNavMenuItem>
                  </SideNavMenu>
                  <SideNavLink
                    renderIcon={Fade}
                    href="https://www.carbondesignsystem.com/"
                    large
                  >
                    Link
                  </SideNavLink>
                  <SideNavLink
                    renderIcon={Fade}
                    href="https://www.carbondesignsystem.com/"
                    large
                  >
                    Link
                  </SideNavLink>
                </SideNavItems>
              </SideNav>
            </Header>
            <ContentLayout className="p-0! min-h-screen!">
              {children}
            </ContentLayout>
          </>
        )}
      />
    </Theme>
  );
};
