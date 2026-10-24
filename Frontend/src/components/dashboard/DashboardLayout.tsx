import { useState, type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaCar } from "react-icons/fa";

import {
  FiGrid,
  FiUsers,
  FiUser,
  FiShield,
  FiSettings,
  FiFileText,
  FiCalendar,
  FiBarChart2,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiMoon,
  FiSun,
  FiMenu,
  FiX,
  FiTruck,
  FiLayers,
  FiHome,
  FiMapPin,
} from "react-icons/fi";



import { useAuth } from "../../auth/AuthContext";
import "../../styles/components/dashboard/DashboardLayout.css";

type DashboardLayoutProps = {
  children: ReactNode;
  title: string;
  subtitle?: string;
};

type MenuItem = {
  label: string;
  path: string;
  icon: ReactNode;
  end?: boolean;
  badge?: string;
};

type MenuGroup = {
  title: string;
  items: MenuItem[];
};

type RoleMenu = {
  overview: MenuItem;
  groups: MenuGroup[];
};

const ROLE_MENUS: Record<string, RoleMenu> = {
  SUPER_ADMIN: {
    overview: {
      label: "Overview",
      path: "/super-admin/dashboard",
      icon: <FiGrid />,
      end: true,
    },
    groups: [
      {
        title: "ADMINISTRATION",
        items: [
          {
            label: "Manage Users",
            path: "/super-admin/users",
            icon: <FiUsers />,
            badge: "USERS",
          },
          {
            label: "Security & Roles",
            path: "/super-admin/users",
            icon: <FiShield />,
          },
          {
            label: "Reports",
            path: "/super-admin/dashboard",
            icon: <FiBarChart2 />,
          },
        ],
      },
      {
        title: "VEHICLE MANAGEMENT",
        items: [
          {
            label: "Car Collection",
            path: "/cars",
            icon: <FaCar />,
          },
          {
            label: "Car Management",
            path: "/admin/cars",
            icon: <FiSettings />,
          },
          {
            label: "Configurations",
            path: "/customer/configurations",
            icon: <FiLayers />,
          },
        ],
      },
      {
        title: "SALES & SERVICES",
        items: [
          {
            label: "Quotations",
            path: "/admin/quotations",
            icon: <FiFileText />,
          },
          {
            label: "Test Drives",
            path: "/customer/test-drives",
            icon: <FiCalendar />,
          },
        ],
      },
      {
        title: "ROLE DASHBOARDS",
        items: [
          {
            label: "Admin Dashboard",
            path: "/admin",
            icon: <FiShield />,
          },
          {
            label: "Manager Dashboard",
            path: "/manager/dashboard",
            icon: <FiUsers />,
          },
          {
            label: "Customer Dashboard",
            path: "/customer/dashboard",
            icon: <FiUser />,
          },
        ],
      },
      {
        title: "SHOWROOM",
        items: [
          {
            label: "Showroom Management",
            path: "/super-admin/showrooms",
            icon: <FiMapPin />,
          },
        ],
      },
    ],
  },

  ADMIN: {
    overview: {
      label: "Overview",
      path: "/admin",
      icon: <FiGrid />,
      end: true,
    },
    groups: [
      {
        title: "VEHICLE MANAGEMENT",
        items: [
          {
            label: "Manage Cars",
            path: "/admin/cars",
            icon: <FaCar />,
          },
          {
            label: "Car Collection",
            path: "/cars",
            icon: <FiLayers />,
          },
        ],
      },
      {
        title: "SALES & SERVICES",
        items: [
          {
            label: "Quotations",
            path: "/admin/quotations",
            icon: <FiFileText />,
          },
          {
            label: "Test Drives",
            path: "/manager",
            icon: <FiCalendar />,
          },
          {
            label: "Customers",
            path: "/manager",
            icon: <FiUsers />,
          },
        ],
      },
    ],
  },

  MANAGER: {
    overview: {
      label: "Overview",
      path: "/manager/dashboard",
      icon: <FiGrid />,
      end: true,
    },
    groups: [
      {
        title: "CUSTOMER OPERATIONS",
        items: [
          {
            label: "Bookings",
            path: "/manager",
            icon: <FiCalendar />,
          },
          {
            label: "Customers",
            path: "/manager",
            icon: <FiUsers />,
          },
          {
            label: "Test Drives",
            path: "/customer/test-drives",
            icon: <FaCar />,
          },
        ],
      },
      {
        title: "SALES",
        items: [
          {
            label: "Quotations",
            path: "/admin/quotations",
            icon: <FiFileText />,
          },
          {
            label: "Car Collection",
            path: "/cars",
            icon: <FiLayers />,
          },
        ],
      },
    ],
  },

  CUSTOMER: {
    overview: {
      label: "Overview",
      path: "/customer/dashboard",
      icon: <FiGrid />,
      end: true,
    },
    groups: [
      {
        title: "MY ACCOUNT",
        items: [
          {
            label: "My Configurations",
            path: "/customer/configurations",
            icon: <FiSettings />,
          },
          {
            label: "My Test Drives",
            path: "/customer/test-drives",
            icon: <FiCalendar />,
          },
          {
            label: "My Quotations",
            path: "/customer/quotations",
            icon: <FiFileText />,
          },
        ],
      },
      {
        title: "EXPLORE",
        items: [
          {
            label: "Explore Cars",
            path: "/cars",
            icon: <FaCar />,
          },
        ],
      },
    ],
  },
};

export default function DashboardLayout({
  children,
  title,
  subtitle = "Luxury showroom management",
}: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [lightTheme, setLightTheme] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const role = user?.role ?? "CUSTOMER";
  const roleLabel = role.replace(/_/g, " ");
  const menu = ROLE_MENUS[role] ?? ROLE_MENUS.CUSTOMER;

  const displayName = user?.fullName?.trim() || "Showroom User";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      setLoggingOut(false);
    }
  }

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  function renderMenuItem(item: MenuItem) {
    return (
      <NavLink
        key={item.label}
        to={item.path}
        end={item.end}
        title={collapsed ? item.label : undefined}
        onClick={closeMobileMenu}
        className={({ isActive }) =>
          [
            "lux-menu-item",
            isActive ? "lux-menu-item--active" : "",
          ]
            .filter(Boolean)
            .join(" ")
        }
      >
        <span className="lux-menu-item__icon">
          {item.icon}
        </span>

        {(!collapsed || mobileOpen) && (
          <span className="lux-menu-item__label">
            {item.label}
          </span>
        )}

        {!collapsed && item.badge && (
          <span className="lux-menu-item__badge">
            {item.badge}
          </span>
        )}
      </NavLink>
    );
  }

  return (
    <div
      className={[
        "lux-dashboard",
        lightTheme
          ? "lux-dashboard--light"
          : "lux-dashboard--dark",
        collapsed ? "lux-dashboard--collapsed" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Mobile menu toggle */}
      <button
        type="button"
        className="lux-mobile-toggle"
        aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((value) => !value)}
      >
        {mobileOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <button
          type="button"
          className="lux-sidebar-backdrop"
          aria-label="Close navigation"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          "lux-sidebar",
          mobileOpen ? "lux-sidebar--mobile-open" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/* Brand */}
        <div className="lux-sidebar__brand">
          <span className="lux-brand-mark">
            <FiShield />
          </span>

          {!collapsed && (
            <div className="lux-brand-copy">
              <strong>LUXORA</strong>
              <small>AUTOMOTIVE</small>
            </div>
          )}
        </div>

        {/* User profile */}
        <div className="lux-sidebar__identity">
          <div className="lux-user-avatar">
            {avatarLetter}
          </div>

          {!collapsed && (
            <div className="lux-user-copy">
              <strong>{displayName}</strong>
              <span>{roleLabel}</span>
            </div>
          )}
        </div>

        <nav
          className="lux-sidebar__nav"
          aria-label="Dashboard navigation"
        >
          {/* Overview is visually separated */}
          <div className="lux-overview-section">
            {!collapsed && (
              <p className="lux-menu-group__title">
                WORKSPACE
              </p>
            )}

            {renderMenuItem(menu.overview)}
          </div>

          {/* Role-specific navigation */}
          {menu.groups.map((group) => (
            <section
              className="lux-menu-group"
              key={group.title}
            >
              {(!collapsed || mobileOpen) && (
                <p className="lux-menu-group__title">
                  {group.title}
                </p>
              )}

              {group.items.map(renderMenuItem)}
            </section>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="lux-sidebar__footer">
          <button
            type="button"
            className="lux-menu-item lux-sidebar__theme"
            onClick={() => setLightTheme((value) => !value)}
            title={
              lightTheme
                ? "Switch to dark theme"
                : "Switch to light theme"
            }
          >
            <span className="lux-menu-item__icon">
              {lightTheme ? <FiMoon /> : <FiSun />}
            </span>

            {!collapsed && (
              <span className="lux-menu-item__label">
                {lightTheme ? "Dark Theme" : "Light Theme"}
              </span>
            )}
          </button>

          <button
            type="button"
            className="lux-menu-item lux-sidebar__logout"
            disabled={loggingOut}
            onClick={() => void handleLogout()}
            title="Logout"
          >
            <span className="lux-menu-item__icon">
              <FiLogOut />
            </span>

            {!collapsed && (
              <span className="lux-menu-item__label">
                {loggingOut ? "Logging out..." : "Logout"}
              </span>
            )}
          </button>

          <button
            type="button"
            className="lux-sidebar__collapse"
            onClick={() => setCollapsed((value) => !value)}
            aria-label={
              collapsed ? "Expand sidebar" : "Collapse sidebar"
            }
            title={
              collapsed ? "Expand sidebar" : "Collapse sidebar"
            }
          >
            {collapsed ? <FiChevronRight /> : <FiChevronLeft />}

            {!collapsed && <span>Collapse sidebar</span>}
          </button>
        </div>
      </aside>

      {/* Main workspace */}
      <div className="lux-dashboard__workspace">
        <header className="lux-topbar">
          <div className="lux-topbar__heading">
            <p className="lux-topbar__eyebrow">
              LUXORA AUTOMOTIVE / {roleLabel}
            </p>

            <h1>{title}</h1>

            <p>{subtitle}</p>
          </div>

          <div className="lux-topbar__profile">
            <div className="lux-topbar__avatar">
              {avatarLetter}
            </div>

            <div className="lux-topbar__profile-copy">
              <strong>{displayName}</strong>
              <span>{roleLabel}</span>
            </div>
          </div>
        </header>

        <main className="lux-dashboard__content">
          {children}
        </main>
      </div>
    </div>
  );
}