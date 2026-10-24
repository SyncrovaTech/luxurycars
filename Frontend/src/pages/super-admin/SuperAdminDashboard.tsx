import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiTruck,
  FiMapPin,
  FiCalendar,
  FiFileText,
  FiRefreshCw,
  FiArrowUpRight,
  FiActivity,
  FiShield,
  FiAlertCircle,
  FiPackage,
  FiCheckCircle,
} from "react-icons/fi";

import { useAuth } from "../../auth/AuthContext";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { getSuperAdminDashboard } from "../../api/dashboard.api";

import "../../styles/pages/super-admin/SuperAdminDashboard.css";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalCars: number;
  totalStock: number;
  totalShowrooms: number;
  totalTestDrives: number;
  totalQuotations: number;
}

interface ActivityItem {
  id: string;
  type: "TEST_DRIVE" | "QUOTATION";
  title: string;
  customer: string;
  status: string;
  date: string | null;
  details: string;
}

const DEFAULT_STATS: DashboardStats = {
  totalUsers: 0,
  activeUsers: 0,
  totalCars: 0,
  totalStock: 0,
  totalShowrooms: 0,
  totalTestDrives: 0,
  totalQuotations: 0,
};

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-IN").format(value);

const formatDate = (value?: string | null) => {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatStatus = (status?: string) => {
  if (!status) return "Unknown";

  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stats, setStats] =
    useState<DashboardStats>(DEFAULT_STATS);

  const [activities, setActivities] =
    useState<ActivityItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getSuperAdminDashboard();

      /*
       * Actual backend response:
       * {
       *   success: true,
       *   data: {
       *     metrics: { users, cars, showrooms, testDrives, quotations },
       *     recentActivity: [],
       *     permissions: {}
       *   }
       * }
       *
       * Axios response data is response.data.
       * Dashboard payload is response.data.data.
       */
      const result = response.data.data;

      if (!result) {
        throw new Error("Dashboard response data is missing.");
      }

      const metrics = result.metrics;

      console.log("Super Admin dashboard metrics:", metrics);
      console.log("Super Admin recent activity:", result.recentActivity);

      setStats({
        totalUsers: Number(metrics?.users?.total ?? 0),
        activeUsers: Number(metrics?.users?.active ?? 0),
        totalCars: Number(metrics?.cars?.total ?? 0),
        totalStock: Number(metrics?.cars?.totalStock ?? 0),
        totalShowrooms: Number(metrics?.showrooms?.total ?? 0),
        totalTestDrives: Number(metrics?.testDrives?.total ?? 0),
        totalQuotations: Number(metrics?.quotations?.total ?? 0),
      });

      setActivities(
        Array.isArray(result.recentActivity)
          ? result.recentActivity.map((item) => ({
              id: item.id,
              type: item.type,
              title: item.title,
              customer: item.customer,
              status: item.status,
              date: item.date,
              details: item.details,
            }))
          : [],
      );
    } catch (err) {
      console.error("Super Admin dashboard error:", err);

      setError(
        "Dashboard data load failed. Please check the API response and server.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      description: `${formatNumber(stats.activeUsers)} active users`,
      icon: FiUsers,
      route: "/super-admin/users",
      className: "users",
    },
    {
      title: "Total Cars",
      value: stats.totalCars,
      description: "Vehicles registered in the system",
      icon: FiTruck,
      route: "/cars",
      className: "cars",
    },
    {
      title: "Showrooms",
      value: stats.totalShowrooms,
      description: "Registered showrooms",
      icon: FiMapPin,
      route: "/super-admin/showrooms",
      className: "showrooms",
    },
    {
      title: "Test Drives",
      value: stats.totalTestDrives,
      description: "All test-drive records",
      icon: FiCalendar,
      route: "/customer/test-drives",
      className: "test-drives",
    },
    {
      title: "Quotations",
      value: stats.totalQuotations,
      description: "All quotation records",
      icon: FiFileText,
      route: "/admin/quotations",
      className: "quotations",
    },
    {
      title: "Total Car Stock",
      value: stats.totalStock,
      description: "Combined vehicle stock quantity",
      icon: FiPackage,
      route: "/admin/cars",
      className: "stock",
    },
  ];

  return (
    <DashboardLayout
      title="Super Admin"
      subtitle="Manage your luxury car showroom platform"
    >
      <div className="sa-dashboard">
        {/* Welcome section */}
        <section className="sa-welcome">
          <div className="sa-welcome__content">
            <div className="sa-welcome__eyebrow">
              <FiShield />
              <span>SUPER ADMIN CONTROL CENTER</span>
            </div>

            <h1>
              Welcome back
              {user?.fullName ? `, ${user.fullName}` : ""}
            </h1>

            <p>
              Monitor your platform, manage operations, and review
              the latest showroom activity from one place.
            </p>
          </div>

          <button
            type="button"
            className="sa-refresh-button"
            onClick={() => void loadDashboard()}
            disabled={loading}
          >
            <FiRefreshCw
              className={loading ? "sa-spinning" : ""}
            />
            {loading ? "Loading..." : "Refresh"}
          </button>
        </section>

        {/* Error message */}
        {error && (
          <div className="sa-error" role="alert">
            <FiAlertCircle />

            <span>{error}</span>

            <button
              type="button"
              onClick={() => void loadDashboard()}
            >
              Retry
            </button>
          </div>
        )}

        {/* Statistics */}
        <section className="sa-section">
          <div className="sa-section__heading">
            <div>
              <span className="sa-section__eyebrow">
                OVERVIEW
              </span>

              <h2>Platform Statistics</h2>

              <p>
                Live counts returned by your backend.
              </p>
            </div>

            <span className="sa-live-status">
              <span className="sa-live-status__dot" />
              {loading ? "Updating..." : "Connected"}
            </span>
          </div>

          <div className="sa-stats-grid">
            {cards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  className={`sa-stat-card sa-stat-card--${card.className}`}
                  key={card.title}
                >
                  <div className="sa-stat-card__top">
                    <div className="sa-stat-card__icon">
                      <Icon />
                    </div>

                    {card.route && (
                      <button
                        type="button"
                        className="sa-stat-card__action"
                        aria-label={`Open ${card.title}`}
                        onClick={() => navigate(card.route)}
                      >
                        <FiArrowUpRight />
                      </button>
                    )}
                  </div>

                  <div className="sa-stat-card__body">
                    <p className="sa-stat-card__title">
                      {card.title}
                    </p>

                    <h3>
                      {loading ? (
                        <span className="sa-skeleton">
                          Loading
                        </span>
                      ) : (
                        formatNumber(card.value)
                      )}
                    </h3>

                    <p className="sa-stat-card__description">
                      {card.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Recent activity and quick actions */}
        <section className="sa-bottom-grid">
          <div className="sa-panel sa-activity-panel">
            <div className="sa-panel__heading">
              <div className="sa-panel__title-icon">
                <FiActivity />
              </div>

              <div>
                <h2>Recent Activity</h2>
                <p>
                  Latest test drives and quotations.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="sa-empty-state">
                Loading recent activity...
              </div>
            ) : activities.length === 0 ? (
              <div className="sa-empty-state">
                <FiActivity />
                <h3>No recent activity</h3>
                <p>
                  New test drives and quotations will appear here.
                </p>
              </div>
            ) : (
              <div className="sa-activity-list">
                {activities.map((activity) => (
                  <article
                    className="sa-activity-item"
                    key={activity.id}
                  >
                    <div className="sa-activity-item__marker">
                      {activity.type === "TEST_DRIVE" ? (
                        <FiCalendar />
                      ) : (
                        <FiFileText />
                      )}
                    </div>

                    <div className="sa-activity-item__content">
                      <h3>{activity.title}</h3>

                      <p>
                        Customer: {activity.customer}
                      </p>

                      {activity.details && (
                        <p>{activity.details}</p>
                      )}

                      <div className="sa-activity-meta">
                        <span
                          className={`sa-activity-status sa-activity-status--${activity.status
                            .toLowerCase()
                            .replace(/_/g, "-")}`}
                        >
                          {formatStatus(activity.status)}
                        </span>

                        <time>
                          {formatDate(activity.date)}
                        </time>
                      </div>

                      <p className="sa-activity-type">
                        {activity.type === "TEST_DRIVE"
                          ? "Test Drive"
                          : "Quotation"}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="sa-panel sa-quick-panel">
            <div className="sa-panel__heading">
              <div className="sa-panel__title-icon">
                <FiShield />
              </div>

              <div>
                <h2>Quick Actions</h2>
                <p>
                  Navigate to management sections.
                </p>
              </div>
            </div>

            <div className="sa-quick-actions">
              <button
                type="button"
                className="sa-quick-action"
                onClick={() => navigate("/super-admin/users")}
              >
                <span className="sa-quick-action__icon">
                  <FiUsers />
                </span>

                <span className="sa-quick-action__text">
                  <strong>Manage Users</strong>
                  <small>
                    View registered user accounts
                  </small>
                </span>

                <FiArrowUpRight className="sa-quick-action__arrow" />
              </button>

              <button
                type="button"
                className="sa-quick-action"
                onClick={() =>
                  navigate("/super-admin/showrooms")
                }
              >
                <span className="sa-quick-action__icon">
                  <FiMapPin />
                </span>

                <span className="sa-quick-action__text">
                  <strong>Manage Showrooms</strong>
                  <small>
                    Review showroom records
                  </small>
                </span>

                <FiArrowUpRight className="sa-quick-action__arrow" />
              </button>

              <button
                type="button"
                className="sa-quick-action"
                onClick={() => navigate("/cars")}
              >
                <span className="sa-quick-action__icon">
                  <FiTruck />
                </span>

                <span className="sa-quick-action__text">
                  <strong>View Cars</strong>
                  <small>
                    Browse the vehicle collection
                  </small>
                </span>

                <FiArrowUpRight className="sa-quick-action__arrow" />
              </button>

              <button
                type="button"
                className="sa-quick-action"
                onClick={() => navigate("/admin/quotations")}
              >
                <span className="sa-quick-action__icon">
                  <FiFileText />
                </span>

                <span className="sa-quick-action__text">
                  <strong>Quotations</strong>
                  <small>
                    Open quotation management
                  </small>
                </span>

                <FiArrowUpRight className="sa-quick-action__arrow" />
              </button>

              <button
                type="button"
                className="sa-quick-action"
                onClick={() =>
                  navigate("/manager/dashboard")
                }
              >
                <span className="sa-quick-action__icon">
                  <FiCheckCircle />
                </span>

                <span className="sa-quick-action__text">
                  <strong>Manager Dashboard</strong>
                  <small>
                    Open manager operations
                  </small>
                </span>

                <FiArrowUpRight className="sa-quick-action__arrow" />
              </button>
            </div>
          </div>
        </section>

        <footer className="sa-dashboard-footer">
          <span>
            <FiShield />
            D-Luxury-Car-Showroom
          </span>

          <span>Super Admin Dashboard</span>
        </footer>
      </div>
    </DashboardLayout>
  );
}