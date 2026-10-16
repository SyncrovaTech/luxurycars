import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { getManagerDashboard } from "../../api/dashboard.api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import "../../styles/pages/manager/ManagerDashboard.css";

export default function ManagerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const response = await getManagerDashboard();

        if (active) {
          setMessage(response.data.message || "");
        }
      } catch {
        // API error હોય તો પણ profile દેખાશે.
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
      title="Manager Dashboard"
      subtitle="Manage bookings and customer operations"
    >
      <div className="bmw-mng-dashboard">
        <header className="bmw-mng-header">
          <h1 className="bmw-mng-header__title">
            Manager Dashboard
          </h1>

          <button
            type="button"
            className="bmw-mng-btn-logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        </header>

        <main className="bmw-mng-main">
          <div className="bmw-mng-card">
            <div className="bmw-mng-card__header">
              <p className="bmw-mng-card__subtitle">
                Manager Profile
              </p>

              <h2 className="bmw-mng-card__name">
                Welcome, {user?.fullName || "Manager"}
              </h2>
            </div>

            <div className="bmw-mng-info-list">
              <div className="bmw-mng-info-row">
                <span>Email Address</span>
                <strong>
                  {user?.email || "Not available"}
                </strong>
              </div>

              <div className="bmw-mng-info-row">
                <span>Account Role</span>
                <span className="bmw-mng-badge">
                  {user?.role || "MANAGER"}
                </span>
              </div>
            </div>

            {message && (
              <div className="bmw-mng-alert">
                {message}
              </div>
            )}
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}