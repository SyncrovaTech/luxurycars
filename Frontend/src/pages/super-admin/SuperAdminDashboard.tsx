//D:\D-Luxury-Car-Showroom\Frontend\src\pages\super-admin\SuperAdminDashboard.tsx
import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../auth/AuthContext";

import {
  getSuperAdminDashboard,
} from "../../api/dashboard.api";

import "../../styles/pages/super-admin/SuperAdminDashboard.css";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

export default function SuperAdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  // Load dashboard data
  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        setError("");

        const response = await getSuperAdminDashboard();

        if (active) {
          setMessage(response.data.message || "");
        }
      } catch (err: unknown) {
        if (active) {
          const apiError = err as {
            response?: {
              data?: {
                message?: string;
              };
            };
          };

          setError(
            apiError.response?.data?.message ||
              "Unable to load Super Admin dashboard."
          );
        }
      }
    }

    void loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  // Logout
  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await logout();
      navigate("/login", { replace: true });
    } catch {
      setError("Logout failed. Please try again.");
      setLoggingOut(false);
    }
  }

  // Navigation
  function openDashboard(path: string) {
    navigate(path);
  }

  return (
  <DashboardLayout
    title="Super Admin Dashboard"
    subtitle="Manage users, roles and showroom operations"
  >
    <div className="bmw-sadm-dashboard">
      {/* HEADER */}
      <header className="bmw-sadm-header">
        <div>
          <p className="bmw-sadm-eyebrow">
            LUXORA AUTOMOTIVE
          </p>

          <h1 className="bmw-sadm-header__title">
            Super Admin Dashboard
          </h1>
        </div>

        <button
          type="button"
          className="bmw-sadm-btn-logout"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </header>

      <main className="bmw-sadm-main">
        {/* PROFILE */}
        <section className="bmw-sadm-card">
          <div className="bmw-sadm-card__header">
            <p className="bmw-sadm-card__subtitle">
              Master Administrator
            </p>

            <h2 className="bmw-sadm-card__name">
              Welcome, {user?.fullName || "Super Admin"}
            </h2>

            <p>
              Manage your showroom operations
              from one central dashboard.
            </p>
          </div>

          <div className="bmw-sadm-info-list">
            <div className="bmw-sadm-info-row">
              <span>Email Address</span>

              <strong>
                {user?.email || "Not available"}
              </strong>
            </div>

            <div className="bmw-sadm-info-row">
              <span>Account Role</span>

              <span className="bmw-sadm-badge">
                {user?.role || "SUPER_ADMIN"}
              </span>
            </div>
          </div>

          {message && (
            <div className="bmw-sadm-alert">
              {message}
            </div>
          )}

          {error && (
            <div
              className="bmw-sadm-alert"
              role="alert"
            >
              {error}
            </div>
          )}
        </section>

        {/* ROLE MANAGEMENT */}
        <section className="bmw-sadm-section">
          <div className="bmw-sadm-section-heading">
            <p className="bmw-sadm-section-label">
              ROLE MANAGEMENT
            </p>

            <h2>Dashboard Access</h2>

            <p>
              Open the available role dashboards.
            </p>
          </div>

          <div className="bmw-sadm-grid">
            {/* ADMIN */}
            <button
              type="button"
              className="bmw-sadm-action-card"
              onClick={() => openDashboard("/admin")}
            >
              <span className="bmw-sadm-action-icon">
                A
              </span>

              <span className="bmw-sadm-action-title">
                Admin Dashboard
              </span>

              <span className="bmw-sadm-action-description">
                Access the administrator interface.
              </span>

              <span className="bmw-sadm-action-link">
                Open Dashboard →
              </span>
            </button>

            {/* MANAGER */}
            <button
              type="button"
              className="bmw-sadm-action-card"
              onClick={() =>
                openDashboard("/manager/dashboard")
              }
            >
              <span className="bmw-sadm-action-icon">
                M
              </span>

              <span className="bmw-sadm-action-title">
                Manager Dashboard
              </span>

              <span className="bmw-sadm-action-description">
                Access manager operations.
              </span>

              <span className="bmw-sadm-action-link">
                Open Dashboard →
              </span>
            </button>

            {/* CUSTOMER */}
            <button
              type="button"
              className="bmw-sadm-action-card"
              onClick={() =>
                openDashboard("/customer/dashboard")
              }
            >
              <span className="bmw-sadm-action-icon">
                C
              </span>

              <span className="bmw-sadm-action-title">
                Customer Dashboard
              </span>

              <span className="bmw-sadm-action-description">
                Access the customer dashboard interface.
              </span>

              <span className="bmw-sadm-action-link">
                Open Dashboard →
              </span>
            </button>

            {/* SUPER ADMIN */}
            <button
              type="button"
              className="bmw-sadm-action-card"
              onClick={() =>
                openDashboard("/super-admin/dashboard")
              }
            >
              <span className="bmw-sadm-action-icon">
                S
              </span>

              <span className="bmw-sadm-action-title">
                Super Admin Dashboard
              </span>

              <span className="bmw-sadm-action-description">
                Return to the master administration panel.
              </span>

              <span className="bmw-sadm-action-link">
                Open Dashboard →
              </span>
            </button>
          </div>
        </section>

        {/* SHOWROOM OPERATIONS */}
        <section className="bmw-sadm-section">
          <div className="bmw-sadm-section-heading">
            <p className="bmw-sadm-section-label">
              SHOWROOM OPERATIONS
            </p>

            <h2>Management Center</h2>

            <p>
              Access showroom operations and management pages.
            </p>
          </div>

          <div className="bmw-sadm-grid">
            {/* CAR COLLECTION */}
            <button
              type="button"
              className="bmw-sadm-action-card"
              onClick={() => openDashboard("/cars")}
            >
              <span className="bmw-sadm-action-icon">
                BMW
              </span>

              <span className="bmw-sadm-action-title">
                Car Collection
              </span>

              <span className="bmw-sadm-action-description">
                Browse available luxury vehicles.
              </span>

              <span className="bmw-sadm-action-link">
                Explore Cars →
              </span>
            </button>

            {/* NEW: CAR MANAGEMENT */}
            <button
              type="button"
              className="bmw-sadm-action-card"
              onClick={() => openDashboard("/admin/cars")}
            >
              <span className="bmw-sadm-action-icon">
                CAR
              </span>

              <span className="bmw-sadm-action-title">
                Car Management
              </span>

              <span className="bmw-sadm-action-description">
                Add vehicles and manage car details,
                prices, engines, variants, colors,
                wheels and interiors.
              </span>

              <span className="bmw-sadm-action-link">
                Manage Vehicles →
              </span>
            </button>

            {/* QUOTATIONS */}
            <button
              type="button"
              className="bmw-sadm-action-card"
              onClick={() =>
                openDashboard("/admin/quotations")
              }
            >
              <span className="bmw-sadm-action-icon">
                Q
              </span>

              <span className="bmw-sadm-action-title">
                Quotation Management
              </span>

              <span className="bmw-sadm-action-description">
                Review and manage customer quotations.
              </span>

              <span className="bmw-sadm-action-link">
                Manage Quotations →
              </span>
            </button>

            {/* SHOWROOM MANAGEMENT */}
            <button
              type="button"
              className="bmw-sadm-action-card"
              onClick={() => openDashboard("/super-admin/showrooms")}
            >
              <span className="bmw-sadm-action-icon">
                SM
              </span>

              <span className="bmw-sadm-action-title">
                Showroom Management
              </span>

              <span className="bmw-sadm-action-description">
                Create showroom branches, update locations,
                manage contact details, opening hours and
                showroom status.
              </span>

              <span className="bmw-sadm-action-link">
                Manage Showrooms →
              </span>
            </button>

            {/* CONFIGURATIONS */}
            <button
              type="button"
              className="bmw-sadm-action-card"
              onClick={() =>
                openDashboard("/customer/configurations")
              }
            >
              <span className="bmw-sadm-action-icon">
                CFG
              </span>

              <span className="bmw-sadm-action-title">
                Car Configurations
              </span>

              <span className="bmw-sadm-action-description">
                Open the configurations dashboard page.
              </span>

              <span className="bmw-sadm-action-link">
                View Configurations →
              </span>
            </button>

            {/* TEST DRIVES */}
            <button
              type="button"
              className="bmw-sadm-action-card"
              onClick={() =>
                openDashboard("/customer/test-drives")
              }
            >
              <span className="bmw-sadm-action-icon">
                TD
              </span>

              <span className="bmw-sadm-action-title">
                Test Drive Management
              </span>

              <span className="bmw-sadm-action-description">
                Open the test drive dashboard page.
              </span>

              <span className="bmw-sadm-action-link">
                View Test Drives →
              </span>
            </button>
          </div>
        </section>

        {/* USER MANAGEMENT */}
        <section className="bmw-sadm-section">
          <div className="bmw-sadm-section-heading">
            <p className="bmw-sadm-section-label">
              USER MANAGEMENT
            </p>

            <h2>All Accounts</h2>

            <p>
              View users, manage roles and control account status.
            </p>
          </div>

          <div className="bmw-sadm-grid">
            <button
              type="button"
              className="bmw-sadm-action-card"
              onClick={() =>
                openDashboard("/super-admin/users")
              }
            >
              <span className="bmw-sadm-action-icon">
                U
              </span>

              <span className="bmw-sadm-action-title">
                All Users
              </span>

              <span className="bmw-sadm-action-description">
                View Admin, Manager, Customer and Super Admin accounts.
              </span>

              <span className="bmw-sadm-action-link">
                Manage Users →
              </span>
            </button>
          </div>
        </section>
      </main>
    </div>
  </DashboardLayout>
);
}