import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import {
  FiUser,
  FiLogOut,
  FiSettings,
  FiChevronDown,
  FiGrid,
  FiFileText,
  FiCalendar,
  FiUsers,
  FiBarChart2,
  FiShield,
} from "react-icons/fi";

import { useAuth } from "../../auth/AuthContext";

import "../../styles/components/navbar/Navbar.css";

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  /*
  |--------------------------------------------------------------------------
  | HIDE NAVBAR ON ALL DASHBOARD PAGES
  |--------------------------------------------------------------------------
  */

  const isDashboardPage =
    location.pathname.startsWith("/customer") ||
    location.pathname.startsWith("/manager") ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/super-admin");

  /*
  |--------------------------------------------------------------------------
  | CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | CLOSE DROPDOWN WHEN ROUTE CHANGES
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  /*
  |--------------------------------------------------------------------------
  | LOGOUT
  |--------------------------------------------------------------------------
  */

  async function handleLogout() {
    setOpen(false);

    try {
      await logout();
    } finally {
      navigate("/");
    }
  }

  /*
  |--------------------------------------------------------------------------
  | USER ROLE LABEL
  |--------------------------------------------------------------------------
  */

  function getRoleLabel() {
    if (!user) {
      return "Customer";
    }

    switch (user.role) {
      case "SUPER_ADMIN":
        return "Super Admin";

      case "ADMIN":
        return "Admin";

      case "MANAGER":
        return "Manager";

      case "CUSTOMER":
      default:
        return "Customer";
    }
  }

  /*
  |--------------------------------------------------------------------------
  | DASHBOARD PATH
  |--------------------------------------------------------------------------
  */

  function getDashboardPath() {
    if (!user) {
      return "/login";
    }

    switch (user.role) {
      case "SUPER_ADMIN":
        return "/super-admin";

      case "ADMIN":
        return "/admin";

      case "MANAGER":
        return "/manager";

      case "CUSTOMER":
      default:
        return "/customer/dashboard";
    }
  }

  /*
  |--------------------------------------------------------------------------
  | HIDE NAVBAR ON DASHBOARD ROUTES
  |--------------------------------------------------------------------------
  */

  if (isDashboardPage) {
    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | NAVBAR UI
  |--------------------------------------------------------------------------
  */

  return (
    <header className="bmw-luxnav">
      <div className="bmw-luxnav__inner">

        {/* LOGO */}

        <Link to="/" className="bmw-luxnav__brand">
          <span className="bmw-luxnav__brand-mark">
            BMW
          </span>

          <span className="bmw-luxnav__brand-text">
            LUXURY
          </span>
        </Link>

        {/* MAIN NAVIGATION */}

        <nav className="bmw-luxnav__links">
          <Link to="/">Home</Link>

          <Link to="/cars">Cars</Link>

          <Link to="/services">Services</Link>

          <Link to="/about">About</Link>

          <Link to="/contact">Contact</Link>
        </nav>

        {/* PROFILE */}

        <div
          className="bmw-luxnav__profile"
          ref={menuRef}
        >
          <button
            type="button"
            className="bmw-luxnav__profile-button"
            onClick={() => setOpen((previous) => !previous)}
            aria-expanded={open}
            aria-label="Open profile menu"
          >
            <span className="bmw-luxnav__avatar">
              <FiUser />
            </span>

            {isLoggedIn && user && (
              <span className="bmw-luxnav__user-name">
                {user.fullName}
              </span>
            )}

            <FiChevronDown
              className={open ? "rotate" : ""}
            />
          </button>

          {/* PROFILE DROPDOWN */}

          {open && (
            <div className="bmw-luxnav__dropdown">

              {/* GUEST MENU */}

              {!isLoggedIn && (
                <>
                  <div className="bmw-luxnav__dropdown-header">
                    <span className="bmw-luxnav__dropdown-avatar">
                      <FiUser />
                    </span>

                    <div>
                      <strong>Customer</strong>

                      <small>
                        Welcome to BMW Luxury
                      </small>
                    </div>
                  </div>

                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="bmw-luxnav__menu-item bmw-luxnav__menu-item--primary"
                  >
                    <FiUser />

                    <span>Login</span>
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="bmw-luxnav__menu-item"
                  >
                    <FiUsers />

                    <span>Create Account</span>
                  </Link>
                </>
              )}

              {/* LOGGED-IN USER MENU */}

              {isLoggedIn && user && (
                <>
                  <div className="bmw-luxnav__dropdown-header">
                    <span className="bmw-luxnav__dropdown-avatar">
                      <FiUser />
                    </span>

                    <div>
                      <strong>{user.fullName}</strong>

                      <small>{getRoleLabel()}</small>
                    </div>
                  </div>

                  {/* DASHBOARD */}

                  <Link
                    to={getDashboardPath()}
                    onClick={() => setOpen(false)}
                    className="bmw-luxnav__menu-item"
                  >
                    <FiGrid />

                    <span>Dashboard</span>
                  </Link>

                  {/* CUSTOMER LINKS */}

                  {user.role === "CUSTOMER" && (
                    <>
                      <Link
                        to="/customer/configurations"
                        onClick={() => setOpen(false)}
                        className="bmw-luxnav__menu-item"
                      >
                        <FiSettings />

                        <span>My Configurations</span>
                      </Link>

                      <Link
                        to="/customer/test-drives"
                        onClick={() => setOpen(false)}
                        className="bmw-luxnav__menu-item"
                      >
                        <FiCalendar />

                        <span>My Test Drives</span>
                      </Link>

                      <Link
                        to="/customer/quotations"
                        onClick={() => setOpen(false)}
                        className="bmw-luxnav__menu-item"
                      >
                        <FiFileText />

                        <span>My Quotations</span>
                      </Link>
                    </>
                  )}

                  {/* MANAGER LINKS */}

                  {user.role === "MANAGER" && (
                    <>
                      <Link
                        to="/manager"
                        onClick={() => setOpen(false)}
                        className="bmw-luxnav__menu-item"
                      >
                        <FiCalendar />

                        <span>Bookings</span>
                      </Link>

                      <Link
                        to="/manager"
                        onClick={() => setOpen(false)}
                        className="bmw-luxnav__menu-item"
                      >
                        <FiUsers />

                        <span>Customers</span>
                      </Link>
                    </>
                  )}

                  {/* ADMIN LINKS */}

                  {(user.role === "ADMIN" ||
                    user.role === "SUPER_ADMIN") && (
                    <>
                      <Link
                        to="/admin/quotations"
                        onClick={() => setOpen(false)}
                        className="bmw-luxnav__menu-item"
                      >
                        <FiFileText />

                        <span>Quotations</span>
                      </Link>

                      <Link
                        to="/admin"
                        onClick={() => setOpen(false)}
                        className="bmw-luxnav__menu-item"
                      >
                        <FiCalendar />

                        <span>Bookings</span>
                      </Link>

                      <Link
                        to="/admin"
                        onClick={() => setOpen(false)}
                        className="bmw-luxnav__menu-item"
                      >
                        <FiUsers />

                        <span>Customers</span>
                      </Link>
                    </>
                  )}

                  {/* SUPER ADMIN LINKS */}

                  {user.role === "SUPER_ADMIN" && (
                    <>
                      <Link
                        to="/super-admin"
                        onClick={() => setOpen(false)}
                        className="bmw-luxnav__menu-item"
                      >
                        <FiShield />

                        <span>Users &amp; Roles</span>
                      </Link>

                      <Link
                        to="/super-admin"
                        onClick={() => setOpen(false)}
                        className="bmw-luxnav__menu-item"
                      >
                        <FiBarChart2 />

                        <span>Reports</span>
                      </Link>
                    </>
                  )}

                  {/* DIVIDER */}

                  <div className="bmw-luxnav__divider" />

                  {/* LOGOUT */}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="bmw-luxnav__menu-item bmw-luxnav__logout"
                  >
                    <FiLogOut />

                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}