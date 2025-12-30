"use client";
import { ContentLayout } from "@/app/components";
import { Category as CaCategory, Fade } from "@carbon/icons-react";
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
} from "@carbon/react";
import Link from "next/link";

export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
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
                  <SideNavMenuItem as={Link} href="/category">
                    Manage Categories
                  </SideNavMenuItem>
                  <SideNavMenuItem as={Link} href="/category/settings">
                    Category Settings
                  </SideNavMenuItem>
                </SideNavMenu>
                <SideNavMenu
                  renderIcon={Fade}
                  title="Product"
                  isActive={true}
                  large
                >
                  <SideNavMenuItem href="https://www.carbondesignsystem.com/">
                    Manage Products
                  </SideNavMenuItem>
                  <SideNavMenuItem
                    aria-current="page"
                    href="https://www.carbondesignsystem.com/"
                  >
                    Product Settings
                  </SideNavMenuItem>
                </SideNavMenu>
                <SideNavMenu renderIcon={Fade} title="Category title" large>
                  <SideNavMenuItem href="https://www.carbondesignsystem.com/">
                    Link
                  </SideNavMenuItem>
                  <SideNavMenuItem href="https://www.carbondesignsystem.com/">
                    Link
                  </SideNavMenuItem>
                  <SideNavMenuItem href="https://www.carbondesignsystem.com/">
                    Link
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
          <ContentLayout className="p-0! min-h-[calc(100vh - 64px)]">
            {children}
          </ContentLayout>
        </>
      )}
    />
  );
};
