"use client";
import { ContentLayout, SignOutModal } from "@/app/components";
import {
  Category as CaCategory,
  Dashboard as DashboardIcon,
  GroupAccess,
  Notification,
  Product,
  UserAvatar,
  VehicleApi,
  User,
  ArrowRight,
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
import { useLogout } from "@/app/features/auth";
import { useProfile } from "@/app/features/profile";
import { Notification as NotificationType } from "@/app/types/notification";
import { getImageUrl } from "@/app/utils/imageUrl";

export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [signOutModalOpen, setSignOutModalOpen] = useState(false);
  const notificationToggleRef = useRef(false);
  const userMenuToggleRef = useRef(false);

  // Fetch notifications from backend
  const { data: notificationsData, isPending: isLoadingNotifications } =
    useGetNotifications();
  const { mutateAsync: markNotificationAsRead } = useMarkNotificationAsRead();
  const { mutateAsync: markAllAsRead } = useMarkAllNotificationsAsRead();
  const { mutateAsync: logoutUser } = useLogout();

  // Fetch user profile for avatar
  const { data: profileData } = useProfile();
  const userProfile = profileData?.user;
  const fullName = userProfile
    ? `${userProfile.first_name || ""} ${userProfile.last_name || ""}`.trim() ||
    userProfile.email
    : "";

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
    setSignOutModalOpen(true);
  };

  const handleProfileNavigate = () => {
    setUserMenuOpen(false);
    router.push("/dashboard/profile");
  };

  const handleSignOutConfirm = async () => {
    try {
      await logoutUser();

      // Clear local state and redirect
      setSignOutModalOpen(false);
      setUserMenuOpen(false);

      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Still redirect even if logout fails
      setSignOutModalOpen(false);
      setUserMenuOpen(false);
      router.push("/login");
    }
  };

  const handleSignOutCancel = () => {
    setSignOutModalOpen(false);
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
              <HeaderName as={Link} href="/dashboard" prefix="CMS">
                Second Chance
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
                    href="/dashboard"
                    isActive={pathname === "/dashboard"}
                    renderIcon={DashboardIcon}
                    large
                  >
                    Dashboard
                  </SideNavLink>
                  <SideNavMenu renderIcon={CaCategory} title="Category" large>
                    <SideNavMenuItem
                      as={Link}
                      href="/dashboard/category"
                      isActive={pathname === "/dashboard/category"}
                    >
                      Manage Categories
                    </SideNavMenuItem>
                    <SideNavMenuItem
                      as={Link}
                      href="/dashboard/category/groups"
                      isActive={pathname === "/dashboard/category/groups"}
                    >
                      Category Groups
                    </SideNavMenuItem>
                    <SideNavMenuItem
                      as={Link}
                      href="/dashboard/category/status"
                      isActive={pathname === "/dashboard/category/status"}
                    >
                      Category Status
                    </SideNavMenuItem>
                  </SideNavMenu>
                  <SideNavMenu
                    renderIcon={GroupAccess}
                    title="User Management"
                    large
                  >
                    <SideNavMenuItem
                      as={Link}
                      href="/dashboard/user"
                      isActive={pathname === "/dashboard/user"}
                    >
                      User
                    </SideNavMenuItem>
                    <SideNavMenuItem
                      as={Link}
                      href="/dashboard/role"
                      isActive={pathname === "/dashboard/role"}
                    >
                      Role
                    </SideNavMenuItem>
                  </SideNavMenu>
                  <SideNavMenu renderIcon={Product} title="Products" large>
                    <SideNavMenuItem
                      as={Link}
                      href="/dashboard/product"
                      isActive={pathname === "/dashboard/product"}
                    >
                      Manage Products
                    </SideNavMenuItem>
                    <SideNavMenuItem
                      as={Link}
                      href="/dashboard/product/status"
                      isActive={pathname === "/dashboard/product/status"}
                    >
                      Product Status
                    </SideNavMenuItem>
                    <SideNavMenuItem
                      as={Link}
                      href="/dashboard/product/condition"
                      isActive={pathname === "/dashboard/product/condition"}
                    >
                      Product Condition
                    </SideNavMenuItem>
                  </SideNavMenu>
                  <SideNavMenu renderIcon={VehicleApi} title="Vehicles" large>
                    <SideNavMenuItem
                      as={Link}
                      href="/dashboard/vehicle"
                      isActive={pathname === "/dashboard/vehicle"}
                    >
                      Manage Vehicles
                    </SideNavMenuItem>
                    <SideNavMenuItem
                      as={Link}
                      href="/dashboard/vehicle/type"
                      isActive={pathname === "/dashboard/vehicle/type"}
                    >
                      Vehicle Type
                    </SideNavMenuItem>
                  </SideNavMenu>
                </SideNavItems>
              </SideNav>
              <HeaderGlobalBar>
                <Popover
                  align="bottom-end"
                  caret={false}
                  isTabTip
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
                        {isLoadingNotifications && (
                          <div className="p-8! text-center! text-gray-500!">
                            <p className="m-0!">Loading notifications...</p>
                          </div>
                        )}
                        {!isLoadingNotifications &&
                          notifications.length === 0 && (
                            <div className="p-8! text-center! text-gray-500!">
                              <p className="m-0!">No notifications</p>
                            </div>
                          )}
                        {!isLoadingNotifications &&
                          notifications.length > 0 && (
                            <ul className="divide-y! divide-gray-200! dark:divide-gray-700! m-0! p-0! list-none!">
                              {notifications.map(
                                (notification: NotificationType) => {
                                  const isRead = notification.is_read;
                                  const notificationBgClass = isRead
                                    ? ""
                                    : "bg-blue-50! dark:bg-blue-900/20!";
                                  const titleColorClass = isRead
                                    ? "text-gray-600! dark:text-gray-400!"
                                    : "text-gray-900! dark:text-gray-100!";
                                  return (
                                    <button
                                      key={notification.id}
                                      className={`p-4! hover:bg-gray-50! dark:hover:bg-gray-800! cursor-pointer! transition-colors! w-full! text-left! border-none! bg-transparent! ${notificationBgClass}`}
                                      onClick={() =>
                                        handleMarkAsRead(notification.id)
                                      }
                                      aria-label={`Mark notification "${notification.title}" as read`}
                                    >
                                      <div className="flex! items-start! justify-between!">
                                        <div className="flex-1!">
                                          <div className="flex! items-center! gap-2! mb-1!">
                                            <h4
                                              className={`font-semibold! text-sm! m-0! ${titleColorClass}`}
                                            >
                                              {notification.title}
                                            </h4>
                                            {!isRead && (
                                              <span className="w-2! h-2! bg-blue-500! rounded-full! shrink-0!"></span>
                                            )}
                                          </div>
                                          <p className="text-sm! text-gray-600! dark:text-gray-400! mb-1! m-0!">
                                            {notification.message}
                                          </p>
                                          <p className="text-xs! text-gray-400! dark:text-gray-500! m-0!">
                                            {formatTimestamp(
                                              notification.created_at,
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                    </button>
                                  );
                                },
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
                            href="/dashboard/notifications"
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
                  dropShadow
                  caret={false}
                  open={userMenuOpen}
                  border
                  isTabTip
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
                      className="w-64! pb-0!"
                      style={{ minWidth: "256px", paddingBottom: "0" }}
                      role="dialog"
                      aria-label="User Menu"
                    >
                      {/* Header */}
                      <div className="flex items-center gap-3 px-4! pt-6! pb-4!">
                        <div className="flex-1! min-w-0!">
                          <p className="text-xl! truncate!" style={{ fontWeight: 400 }}>
                            {fullName || userProfile?.email || "User"}
                          </p>
                        </div>
                        <div className="rounded-full! w-14! h-14! bg-[#393939]! shrink-0! overflow-hidden! flex! items-center! justify-center!">
                          {userProfile?.profile_picture ? (
                            <img
                              src={getImageUrl(userProfile.profile_picture)}
                              alt={fullName || "User"}
                              className="w-full! h-full! object-cover! rounded-full!"
                              onError={(e) => {
                                // Fallback to User icon if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                                const parent = target.parentElement;
                                if (parent && !parent.querySelector(".avatar-fallback")) {
                                  const fallback = document.createElement("div");
                                  fallback.className = "avatar-fallback flex! items-center! justify-center!";
                                  const userIcon = document.createElementNS(
                                    "http://www.w3.org/2000/svg",
                                    "svg",
                                  );
                                  userIcon.setAttribute("width", "28");
                                  userIcon.setAttribute("height", "28");
                                  userIcon.setAttribute("viewBox", "0 0 32 32");
                                  userIcon.setAttribute("fill", "currentColor");
                                  userIcon.innerHTML =
                                    '<path d="M16 8a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3z"/><path d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2zm0 26a12 12 0 0 1-10.29-5.79l5.71-5.71a2 2 0 0 1 2.83 0l5.71 5.71A12 12 0 0 1 16 28zm0-24a12 12 0 0 1 10.29 18.79l-5.71-5.71a2 2 0 0 0-2.83 0l-5.71 5.71A12 12 0 0 1 16 4z"/>';
                                  fallback.appendChild(userIcon);
                                  parent.appendChild(fallback);
                                }
                              }}
                            />
                          ) : (
                            <User size={28} />
                          )}
                        </div>
                      </div>

                      {/* Menu Items */}
                      <Button
                        className="w-full!"
                        kind="ghost"
                        onClick={handleProfileNavigate}
                      >
                        Profile
                      </Button>
                      <Button className="w-full!" kind="ghost">
                        Settings
                      </Button>
                      <Button
                        className="w-full!"
                        kind="secondary"
                        onClick={handleLogout}
                      >
                        <span className="flex! items-center! gap-2!">
                          Log out <ArrowRight size={15} />
                        </span>
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </HeaderGlobalBar>
            </Header>

            <ContentLayout className="p-0! min-h-screen!">
              {children}
            </ContentLayout>

            <SignOutModal
              open={signOutModalOpen}
              onClose={handleSignOutCancel}
              onConfirm={handleSignOutConfirm}
            />
          </>
        )}
      />
    </Theme>
  );
};
