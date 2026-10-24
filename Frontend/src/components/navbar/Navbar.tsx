import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  FiMenu,
  FiX,
  FiLogIn,
  FiUserPlus,
} from "react-icons/fi";

import { useAuth } from "../../auth/AuthContext";
import "../../styles/components/navbar/Navbar.css";

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const mobileWrapperRef = useRef<HTMLDivElement>(null);

  // Hide navbar on dashboard pages
  const isDashboardPage =
    location.pathname.startsWith("/customer") ||
    location.pathname.startsWith("/manager") ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/super-admin");

  // Handle outside clicks
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (menuRef.current && !menuRef.current.contains(target)) {
        setOpen(false);
      }

      if (
        mobileWrapperRef.current &&
        !mobileWrapperRef.current.contains(target)
      ) {
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close menus on route change
  useEffect(() => {
    setOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on desktop resize
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 868) {
        setMobileMenuOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  async function handleLogout() {
    setOpen(false);
    setMobileMenuOpen(false);

    try {
      await logout();
    } finally {
      navigate("/");
    }
  }

  function getRoleLabel() {
    if (!user) return "Customer";

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

  function getDashboardPath() {
    if (!user) return "/login";

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

  function closeMenus() {
    setOpen(false);
    setMobileMenuOpen(false);
  }

  if (isDashboardPage) {
    return null;
  }

  const navigationLinks = [
    { label: "Home", path: "/" },
    { label: "Cars", path: "/cars" },
    { label: "Services", path: "/services" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  const recommendationPath = "/car-recommendations";

  return (
    <header className="bmw-luxnav">
      <div className="bmw-luxnav__inner">
        {/* BRAND LOGO */}
        <Link
          to="/"
          className="bmw-luxnav__brand"
          onClick={closeMenus}
          aria-label="BMW Luxury Home"
        >
          <span className="bmw-luxnav__brand-mark">BMW</span>
          <span className="bmw-luxnav__brand-text">LUXURY</span>
        </Link>

        {/* DESKTOP LINKS */}
        <nav className="bmw-luxnav__links" aria-label="Main navigation">
          {navigationLinks.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={
                location.pathname === item.path
                  ? "bmw-luxnav__link bmw-luxnav__link--active"
                  : "bmw-luxnav__link"
              }
            >
              {item.label}
            </Link>
          ))}

          {/* AI CAR RECOMMENDATION LINK */}
          <Link
            to={recommendationPath}
            className={
              location.pathname === recommendationPath
                ? "bmw-luxnav__link bmw-luxnav__link--active"
                : "bmw-luxnav__link"
            }
          >
            Find Your Perfect Car
          </Link>
        </nav>

        {/* DESKTOP PROFILE MENU */}
        <div className="bmw-luxnav__profile" ref={menuRef}>
          <button
            type="button"
            className="bmw-luxnav__profile-button"
            onClick={() => setOpen((prev) => !prev)}
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

            <FiChevronDown className={open ? "rotate" : ""} />
          </button>

          {open && (
            <div className="bmw-luxnav__dropdown">
              {!isLoggedIn ? (
                <>
                  <div className="bmw-luxnav__dropdown-header">
                    <span className="bmw-luxnav__dropdown-avatar">
                      <FiUser />
                    </span>

                    <div>
                      <strong>Welcome, Guest</strong>
                      <small>Welcome to BMW Luxury</small>
                    </div>
                  </div>

                  <Link
                    to="/login"
                    onClick={closeMenus}
                    className="bmw-luxnav__menu-item bmw-luxnav__menu-item--primary"
                  >
                    <FiLogIn />
                    <span>Login</span>
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenus}
                    className="bmw-luxnav__menu-item"
                  >
                    <FiUserPlus />
                    <span>Create Account</span>
                  </Link>
                </>
              ) : (
                <>
                  <div className="bmw-luxnav__dropdown-header">
                    <span className="bmw-luxnav__dropdown-avatar">
                      <FiUser />
                    </span>

                    <div>
                      <strong>{user?.fullName}</strong>
                      <small>{getRoleLabel()}</small>
                    </div>
                  </div>

                  <Link
                    to={getDashboardPath()}
                    onClick={closeMenus}
                    className="bmw-luxnav__menu-item"
                  >
                    <FiGrid />
                    <span>Dashboard</span>
                  </Link>

                  {/* CUSTOMER MENU */}
                  {user?.role === "CUSTOMER" && (
                    <>
                      <Link
                        to="/customer/configurations"
                        onClick={closeMenus}
                        className="bmw-luxnav__menu-item"
                      >
                        <FiSettings />
                        <span>My Configurations</span>
                      </Link>

                      <Link
                        to="/customer/test-drives"
                        onClick={closeMenus}
                        className="bmw-luxnav__menu-item"
                      >
                        <FiCalendar />
                        <span>My Test Drives</span>
                      </Link>

                      <Link
                        to="/customer/quotations"
                        onClick={closeMenus}
                        className="bmw-luxnav__menu-item"
                      >
                        <FiFileText />
                        <span>My Quotations</span>
                      </Link>
                    </>
                  )}

                  {/* MANAGER MENU */}
                  {user?.role === "MANAGER" && (
                    <>
                      <Link
                        to="/manager"
                        onClick={closeMenus}
                        className="bmw-luxnav__menu-item"
                      >
                        <FiCalendar />
                        <span>Bookings</span>
                      </Link>

                      <Link
                        to="/manager"
                        onClick={closeMenus}
                        className="bmw-luxnav__menu-item"
                      >
                        <FiUsers />
                        <span>Customers</span>
                      </Link>
                    </>
                  )}

                  {/* ADMIN MENU */}
                  {(user?.role === "ADMIN" ||
                    user?.role === "SUPER_ADMIN") && (
                    <>
                      <Link
                        to="/admin/quotations"
                        onClick={closeMenus}
                        className="bmw-luxnav__menu-item"
                      >
                        <FiFileText />
                        <span>Quotations</span>
                      </Link>

                      <Link
                        to="/admin"
                        onClick={closeMenus}
                        className="bmw-luxnav__menu-item"
                      >
                        <FiCalendar />
                        <span>Bookings</span>
                      </Link>

                      <Link
                        to="/admin"
                        onClick={closeMenus}
                        className="bmw-luxnav__menu-item"
                      >
                        <FiUsers />
                        <span>Customers</span>
                      </Link>
                    </>
                  )}

                  {/* SUPER ADMIN MENU */}
                  {user?.role === "SUPER_ADMIN" && (
                    <>
                      <Link
                        to="/super-admin"
                        onClick={closeMenus}
                        className="bmw-luxnav__menu-item"
                      >
                        <FiShield />
                        <span>Users &amp; Roles</span>
                      </Link>

                      <Link
                        to="/super-admin"
                        onClick={closeMenus}
                        className="bmw-luxnav__menu-item"
                      >
                        <FiBarChart2 />
                        <span>Reports</span>
                      </Link>
                    </>
                  )}

                  <div className="bmw-luxnav__divider" />

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

        {/* MOBILE CONTROLS & MENU */}
        <div
          className="bmw-luxnav__mobile-wrapper"
          ref={mobileWrapperRef}
        >
          <button
            type="button"
            className="bmw-luxnav__mobile-toggle"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="bmw-mobile-navigation"
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>

          {mobileMenuOpen && (
            <nav
              id="bmw-mobile-navigation"
              className="bmw-luxnav__mobile-menu"
              aria-label="Mobile navigation"
            >
              {/* MOBILE USER CARD */}
              <div className="bmw-luxnav__mobile-user-card">
                <span className="bmw-luxnav__dropdown-avatar">
                  <FiUser />
                </span>

                <div>
                  <strong>
                    {isLoggedIn && user
                      ? user.fullName
                      : "Welcome, Guest"}
                  </strong>

                  <small>
                    {isLoggedIn && user
                      ? getRoleLabel()
                      : "BMW Luxury Experience"}
                  </small>
                </div>
              </div>

              {/* MOBILE MAIN LINKS */}
              {navigationLinks.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMenus}
                  className={
                    location.pathname === item.path
                      ? "bmw-luxnav__mobile-link bmw-luxnav__mobile-link--active"
                      : "bmw-luxnav__mobile-link"
                  }
                >
                  {item.label}
                </Link>
              ))}

              {/* MOBILE AI CAR RECOMMENDATION LINK */}
              <Link
                to={recommendationPath}
                onClick={closeMenus}
                className={
                  location.pathname === recommendationPath
                    ? "bmw-luxnav__mobile-link bmw-luxnav__mobile-link--active"
                    : "bmw-luxnav__mobile-link"
                }
              >
                Find Your Perfect Car
              </Link>

              <div className="bmw-luxnav__mobile-divider" />

              {/* GUEST AUTH ACTIONS */}
              {!isLoggedIn ? (
                <div className="bmw-luxnav__mobile-auth-actions">
                  <Link
                    to="/login"
                    onClick={closeMenus}
                    className="bmw-luxnav__mobile-btn bmw-luxnav__mobile-btn--primary"
                  >
                    <FiLogIn />
                    <span>Login</span>
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenus}
                    className="bmw-luxnav__mobile-btn bmw-luxnav__mobile-btn--secondary"
                  >
                    <FiUserPlus />
                    <span>Create Account</span>
                  </Link>
                </div>
              ) : (
                <>
                  <Link
                    to={getDashboardPath()}
                    onClick={closeMenus}
                    className="bmw-luxnav__mobile-link"
                  >
                    <FiGrid />
                    <span>Dashboard</span>
                  </Link>

                  {/* CUSTOMER MOBILE MENU */}
                  {user?.role === "CUSTOMER" && (
                    <>
                      <Link
                        to="/customer/configurations"
                        onClick={closeMenus}
                        className="bmw-luxnav__mobile-link"
                      >
                        <FiSettings />
                        <span>My Configurations</span>
                      </Link>

                      <Link
                        to="/customer/test-drives"
                        onClick={closeMenus}
                        className="bmw-luxnav__mobile-link"
                      >
                        <FiCalendar />
                        <span>My Test Drives</span>
                      </Link>

                      <Link
                        to="/customer/quotations"
                        onClick={closeMenus}
                        className="bmw-luxnav__mobile-link"
                      >
                        <FiFileText />
                        <span>My Quotations</span>
                      </Link>
                    </>
                  )}

                  {/* MANAGER MOBILE MENU */}
                  {user?.role === "MANAGER" && (
                    <>
                      <Link
                        to="/manager"
                        onClick={closeMenus}
                        className="bmw-luxnav__mobile-link"
                      >
                        <FiCalendar />
                        <span>Bookings</span>
                      </Link>

                      <Link
                        to="/manager"
                        onClick={closeMenus}
                        className="bmw-luxnav__mobile-link"
                      >
                        <FiUsers />
                        <span>Customers</span>
                      </Link>
                    </>
                  )}

                  {/* ADMIN MOBILE MENU */}
                  {(user?.role === "ADMIN" ||
                    user?.role === "SUPER_ADMIN") && (
                    <>
                      <Link
                        to="/admin/quotations"
                        onClick={closeMenus}
                        className="bmw-luxnav__mobile-link"
                      >
                        <FiFileText />
                        <span>Quotations</span>
                      </Link>

                      <Link
                        to="/admin"
                        onClick={closeMenus}
                        className="bmw-luxnav__mobile-link"
                      >
                        <FiCalendar />
                        <span>Bookings &amp; Customers</span>
                      </Link>
                    </>
                  )}

                  {/* SUPER ADMIN MOBILE MENU */}
                  {user?.role === "SUPER_ADMIN" && (
                    <Link
                      to="/super-admin"
                      onClick={closeMenus}
                      className="bmw-luxnav__mobile-link"
                    >
                      <FiShield />
                      <span>Users &amp; Reports</span>
                    </Link>
                  )}

                  {/* LOGOUT */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="bmw-luxnav__mobile-link bmw-luxnav__mobile-logout"
                  >
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}