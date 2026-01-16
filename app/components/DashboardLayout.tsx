"use client";
import { ContentLayout } from "@/app/components";
import {
  Category as CaCategory,
  Dashboard as DashboardIcon,
  GroupAccess,
  Notification,
  Product,
  Switcher,
  UserAvatar,
  VehicleApi,
  User,
  Settings,
  Logout,
} from "@carbon/icons-react";
import {
  Header,
  HeaderContainer,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderMenuButton,
  HeaderName,
  SideNav,
  SideNavItems,
  SideNavLink,
  SideNavMenu,
  SideNavMenuItem,
  SkipToContent,
  Theme,
  Button,
  Popover,
  PopoverContent,
} from "@carbon/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef } from "react";
import {
  useGetNotifications,
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
} from "@/app/features/notification";
import { Notification as NotificationType } from "@/app/types/notification";

export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const notificationToggleRef = useRef(false);
  const userMenuToggleRef = useRef(false);

  // Fetch notifications from backend
  const { data: notificationsData, isPending: isLoadingNotifications } =
    useGetNotifications();
  const { mutateAsync: markNotificationAsRead } = useMarkNotificationAsRead();
  const { mutateAsync: markAllAsRead } = useMarkAllNotificationsAsRead();

  const notifications = notificationsData?.notifications || [];
  const unreadCount = notificationsData?.unread_count || 0;

  const handleNotificationClose = () => {
    setNotificationOpen(false);
  };

  const handleNotificationToggle = () => {
    notificationToggleRef.current = true;
    setNotificationOpen((prev) => !prev);
    // Reset flag after state update
    setTimeout(() => {
      notificationToggleRef.current = false;
    }, 0);
  };

  const handleUserMenuToggle = () => {
    userMenuToggleRef.current = true;
    setUserMenuOpen((prev) => !prev);
    // Reset flag after state update
    setTimeout(() => {
      userMenuToggleRef.current = false;
    }, 0);
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await markNotificationAsRead(id);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const handleLogout = async () => {
    try {
      // Call logout endpoint if it exists
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/logout`, {
        method: "POST",
        credentials: "include",
      });

      // Even if logout endpoint fails, clear local state and redirect
      // Clear any local storage or cookies if needed
      setUserMenuOpen(false);

      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Still redirect even if logout fails
      setUserMenuOpen(false);
      router.push("/login");
    }
  };

  // Format timestamp to relative time
  const formatTimestamp = (timestamp?: string): string => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  return (
    <Theme theme="g100">
      <HeaderContainer
        render={({ isSideNavExpanded, onClickSideNavExpand }) => (
          <>
            <Header aria-label="Platform Name">
              <SkipToContent />
              <HeaderMenuButton
                aria-label={isSideNavExpanded ? "Close menu" : "Open menu"}
                onClick={onClickSideNavExpand}
                isActive={isSideNavExpanded}
                aria-expanded={isSideNavExpanded}
              />
              <HeaderName href="#" prefix="Second Chance">
                [CMS]
              </HeaderName>
              <SideNav
                aria-label="Side navigation"
                expanded={isSideNavExpanded}
                onSideNavBlur={onClickSideNavExpand}
                href="#main-content"
              >
                <SideNavItems>
                  <SideNavLink
                    as={Link}
                    href="/app"
                    isActive={pathname === "/app"}
                    renderIcon={DashboardIcon}
                    large
                  >
                    Dashboard
                  </SideNavLink>
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
                      href="/category/groups"
                      isActive={pathname === "/category/groups"}
                    >
                      Category Groups
                    </SideNavMenuItem>
                    <SideNavMenuItem
                      as={Link}
                      href="/category/status"
                      isActive={pathname === "/category/status"}
                    >
                      Category Status
                    </SideNavMenuItem>
                  </SideNavMenu>
                  <SideNavMenu renderIcon={GroupAccess} title="IAM" large>
                    <SideNavMenuItem
                      as={Link}
                      href="/user"
                      isActive={pathname === "/user"}
                    >
                      User
                    </SideNavMenuItem>
                    <SideNavMenuItem
                      as={Link}
                      href="/role"
                      isActive={pathname === "/role"}
                    >
                      Role
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
                      href="/product/status"
                      isActive={pathname === "/product/status"}
                    >
                      Product Status
                    </SideNavMenuItem>
                    <SideNavMenuItem
                      as={Link}
                      href="/product/condition"
                      isActive={pathname === "/product/condition"}
                    >
                      Product Condition
                    </SideNavMenuItem>
                  </SideNavMenu>
                  <SideNavMenu renderIcon={VehicleApi} title="Vehicles" large>
                    <SideNavMenuItem
                      as={Link}
                      href="/vehicle"
                      isActive={pathname === "/vehicle"}
                    >
                      Manage Vehicles
                    </SideNavMenuItem>
                    <SideNavMenuItem
                      as={Link}
                      href="/vehicle/type"
                      isActive={pathname === "/vehicle/type"}
                    >
                      Vehicle Type
                    </SideNavMenuItem>
                  </SideNavMenu>
                </SideNavItems>
              </SideNav>
              <HeaderGlobalBar>
                <Popover
                  align="bottom-end"
                  caret
                  dropShadow
                  open={notificationOpen}
                  border
                  onRequestClose={() => {
                    // Don't close if we're in the middle of a button toggle
                    if (!notificationToggleRef.current) {
                      setNotificationOpen(false);
                    }
                  }}
                >
                  <HeaderGlobalAction
                    aria-label="Notifications"
                    aria-expanded={notificationOpen}
                    aria-controls="notification-popover"
                    aria-haspopup="dialog"
                    tooltipAlignment="center"
                    className="action-icons"
                    onClick={handleNotificationToggle}
                    isActive={notificationOpen}
                    badgeCount={unreadCount > 0 ? unreadCount : undefined}
                  >
                    <Notification size={20} />
                  </HeaderGlobalAction>
                  <PopoverContent className="p-0!">
                    <div
                      id="notification-popover"
                      className="w-80!"
                      style={{ minWidth: "320px" }}
                      role="dialog"
                      aria-label="Notifications"
                    >
                      {/* Header */}
                      <div className="flex! items-center! justify-between! p-4! border-b! border-gray-200! dark:border-gray-700!">
                        <h3 className="text-lg! font-semibold! m-0!">
                          Notifications
                        </h3>
                        {unreadCount > 0 && (
                          <Button
                            kind="ghost"
                            size="sm"
                            onClick={handleMarkAllAsRead}
                            className="text-sm!"
                            disabled={isLoadingNotifications}
                          >
                            Mark all read
                          </Button>
                        )}
                      </div>

                      {/* Notification List */}
                      <div className="max-h-96! overflow-y-auto!">
                        {isLoadingNotifications ? (
                          <div className="p-8! text-center! text-gray-500!">
                            <p className="m-0!">Loading notifications...</p>
                          </div>
                        ) : notifications.length === 0 ? (
                          <div className="p-8! text-center! text-gray-500!">
                            <p className="m-0!">No notifications</p>
                          </div>
                        ) : (
                          <ul className="divide-y! divide-gray-200! dark:divide-gray-700! m-0! p-0! list-none!">
                            {notifications.map(
                              (notification: NotificationType) => (
                                <li
                                  key={notification.id}
                                  className={`p-4! hover:bg-gray-50! dark:hover:bg-gray-800! cursor-pointer! transition-colors! ${
                                    !notification.is_read
                                      ? "bg-blue-50! dark:bg-blue-900/20!"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    handleMarkAsRead(notification.id)
                                  }
                                >
                                  <div className="flex! items-start! justify-between!">
                                    <div className="flex-1!">
                                      <div className="flex! items-center! gap-2! mb-1!">
                                        <h4
                                          className={`font-semibold! text-sm! m-0! ${
                                            !notification.is_read
                                              ? "text-gray-900! dark:text-gray-100!"
                                              : "text-gray-600! dark:text-gray-400!"
                                          }`}
                                        >
                                          {notification.title}
                                        </h4>
                                        {!notification.is_read && (
                                          <span className="w-2! h-2! bg-blue-500! rounded-full! shrink-0!"></span>
                                        )}
                                      </div>
                                      <p className="text-sm! text-gray-600! dark:text-gray-400! mb-1! m-0!">
                                        {notification.message}
                                      </p>
                                      <p className="text-xs! text-gray-400! dark:text-gray-500! m-0!">
                                        {formatTimestamp(
                                          notification.created_at
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                </li>
                              )
                            )}
                          </ul>
                        )}
                      </div>

                      {/* Footer */}
                      {notifications.length > 0 && (
                        <div className="p-3! border-t! border-gray-200! dark:border-gray-700! text-center!">
                          <Button
                            kind="ghost"
                            size="sm"
                            as={Link}
                            href="/notifications"
                            onClick={handleNotificationClose}
                          >
                            View all notifications
                          </Button>
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover
                  align="bottom-end"
                  caret
                  dropShadow
                  open={userMenuOpen}
                  border
                  onRequestClose={() => {
                    // Don't close if we're in the middle of a button toggle
                    if (!userMenuToggleRef.current) {
                      setUserMenuOpen(false);
                    }
                  }}
                >
                  <HeaderGlobalAction
                    aria-label="User Menu"
                    aria-expanded={userMenuOpen}
                    aria-controls="user-menu-popover"
                    aria-haspopup="dialog"
                    tooltipAlignment="end"
                    className="action-icons"
                    onClick={handleUserMenuToggle}
                    isActive={userMenuOpen}
                  >
                    <UserAvatar size={20} />
                  </HeaderGlobalAction>
                  <PopoverContent className="p-0!">
                    <div
                      id="user-menu-popover"
                      className="w-64!"
                      style={{ minWidth: "256px" }}
                      role="dialog"
                      aria-label="User Menu"
                    >
                      {/* Header */}
                      <div className="flex! items-center! gap-3! p-4! border-b! border-gray-200! dark:border-gray-700!">
                        <div className="flex! items-center! justify-center! w-10! h-10! rounded-full! bg-blue-500! text-white!">
                          <UserAvatar size={20} />
                        </div>
                        <div className="flex-1! min-w-0!">
                          <p className="text-sm! font-semibold! text-gray-900! dark:text-gray-100! m-0! truncate!">
                            User Account
                          </p>
                          <p className="text-xs! text-gray-500! dark:text-gray-400! m-0! truncate!">
                            Administrator
                          </p>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2!">
                        <button
                          className="w-full! flex! items-center! gap-3! px-4! py-3! text-left! text-gray-900! dark:text-gray-100! hover:bg-gray-100! dark:hover:bg-gray-800! transition-colors! border-none! bg-transparent! cursor-pointer! no-underline!"
                          onClick={() => {
                            setUserMenuOpen(false);
                            // TODO: Navigate to profile page
                          }}
                        >
                          <User size={16} />
                          <span className="text-sm!">My Profile</span>
                        </button>
                        <button
                          className="w-full! flex! items-center! gap-3! px-4! py-3! text-left! text-gray-900! dark:text-gray-100! hover:bg-gray-100! dark:hover:bg-gray-800! transition-colors! border-none! bg-transparent! cursor-pointer! no-underline!"
                          onClick={() => {
                            setUserMenuOpen(false);
                            // TODO: Navigate to settings page
                          }}
                        >
                          <Settings size={16} />
                          <span className="text-sm!">Settings</span>
                        </button>
                        <div className="border-t! border-gray-200! dark:border-gray-700! my-2!"></div>
                        <button
                          className="w-full! flex! items-center! gap-3! px-4! py-3! text-left! text-red-600! dark:text-red-400! hover:bg-red-50! dark:hover:bg-red-900/20! transition-colors! border-none! bg-transparent! cursor-pointer! no-underline!"
                          onClick={handleLogout}
                        >
                          <Logout size={16} />
                          <span className="text-sm!">Logout</span>
                        </button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </HeaderGlobalBar>
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
