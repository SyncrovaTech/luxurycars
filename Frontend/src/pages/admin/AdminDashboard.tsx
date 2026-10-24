import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { getAdminDashboard } from "../../api/dashboard.api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import "../../styles/pages/admin/AdminDashboard.css";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const response = await getAdminDashboard();

        if (active) {
          setMessage(response.data.message || "");
        }
      } catch {
        // Dashboard API fails તો પણ page usable રહેશે.
      }
    }

    void loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <DashboardLayout
      title="Admin Dashboard"
      subtitle="Manage vehicles, quotations and showroom operations"
    >
      <div className="bmw-adm-dashboard">
        <header className="bmw-adm-header">
          <h1 className="bmw-adm-header__title">
            Admin Dashboard
          </h1>

          <div className="bmw-adm-header__actions">
            <button
              type="button"
              className="bmw-adm-btn bmw-adm-btn--primary"
              onClick={() => navigate("/admin/quotations")}
            >
              Manage Quotations
            </button>

            <button
              type="button"
              className="bmw-adm-btn bmw-adm-btn--primary"
              onClick={() => navigate("/admin/cars")}
            >
              Manage Cars
            </button>

            <button
              type="button"
              className="bmw-adm-btn bmw-adm-btn--danger"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>

        <main className="bmw-adm-main">
          <div className="bmw-adm-card">
            <div className="bmw-adm-card__header">
              <p className="bmw-adm-card__subtitle">
                Administrator Profile
              </p>

              <h2 className="bmw-adm-card__name">
                Welcome, {user?.fullName || "Admin"}
              </h2>
            </div>

            <div className="bmw-adm-info-list">
              <div className="bmw-adm-info-row">
                <span>Email Address</span>
                <strong>{user?.email || "Not available"}</strong>
              </div>

              <div className="bmw-adm-info-row">
                <span>Account Role</span>
                <span className="bmw-adm-badge">
                  {user?.role || "ADMIN"}
                </span>
              </div>
            </div>

            {message && (
              <div className="bmw-adm-alert">
                {message}
              </div>
            )}
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}