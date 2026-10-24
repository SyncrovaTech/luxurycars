import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

import { getCustomerDashboard } from "../../api/dashboard.api";

import {
  getMyConfigurations,
  deleteConfiguration,
  type Configuration,
} from "../../api/configurations.api";

import {
  getMyTestDrives,
  cancelTestDrive,
  type TestDrive,
} from "../../api/testDrives.api";

import {
  getMyQuotations,
  type Quotation,
} from "../../api/quotations.api";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

import "../../styles/pages/customer/CustomerDashboard.css";

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [message, setMessage] = useState("");
  const [configurations, setConfigurations] = useState<Configuration[]>([]);
  const [testDrives, setTestDrives] = useState<TestDrive[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const dashboardResponse = await getCustomerDashboard();
      setMessage(dashboardResponse.data.message || "");

      const [
        configurationResponse,
        testDriveResponse,
        quotationResponse,
      ] = await Promise.all([
        getMyConfigurations(),
        getMyTestDrives(),
        getMyQuotations(),
      ]);

      setConfigurations(configurationResponse.data || []);
      setTestDrives(testDriveResponse.data || []);
      setQuotations(quotationResponse.data || []);
    } catch (err: unknown) {
      const apiError = err as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

      setError(
        apiError.response?.data?.message ||
          "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

  async function handleDeleteConfiguration(id: string) {
    const confirmed = window.confirm(
      "Delete this saved configuration?"
    );

    if (!confirmed) return;

    try {
      await deleteConfiguration(id);

      setConfigurations((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (err: unknown) {
      const apiError = err as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

      window.alert(
        apiError.response?.data?.message ||
          "Unable to delete configuration."
      );
    }
  }

  async function handleCancelTestDrive(id: string) {
    const confirmed = window.confirm(
      "Cancel this test drive?"
    );

    if (!confirmed) return;

    try {
      const response = await cancelTestDrive(id);
      const updated = response.data;

      setTestDrives((prev) =>
        prev.map((item) =>
          item._id === id ? updated : item
        )
      );
    } catch (err: unknown) {
      const apiError = err as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

      window.alert(
        apiError.response?.data?.message ||
          "Unable to cancel test drive."
      );
    }
  }

  async function handleLogout() {
    await logout();
    navigate("/", { replace: true });
  }

  if (loading) {
    return (
      <DashboardLayout
        title="Customer Dashboard"
        subtitle="Manage your configurations, test drives and quotations"
      >
        <div className="bmw-cdb-loading">
          Loading your luxury showroom...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Customer Dashboard"
      subtitle="Manage your configurations, test drives and quotations"
    >
      <main className="bmw-cdb-page">
        <div className="bmw-cdb-container">
          <header className="bmw-cdb-header">
            <div>
              <h1 className="bmw-cdb-title">
                Welcome
                {user?.fullName ? `, ${user.fullName}` : ""}
              </h1>

              <p className="bmw-cdb-subtitle">
                Manage your luxury car configurations,
                quotations, and test drives.
              </p>
            </div>

            <button
              type="button"
              className="bmw-cdb-logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </header>

          {message && (
            <div className="bmw-cdb-empty">
              {message}
            </div>
          )}

          {error && (
            <div className="bmw-cdb-empty" role="alert">
              {error}
            </div>
          )}

          <section className="bmw-cdb-stats-grid">
            <div className="bmw-cdb-stat-card">
              <div className="bmw-cdb-stat-val">
                {configurations.length}
              </div>
              <div className="bmw-cdb-stat-label">
                Saved Configurations
              </div>
            </div>

            <div className="bmw-cdb-stat-card">
              <div className="bmw-cdb-stat-val">
                {testDrives.length}
              </div>
              <div className="bmw-cdb-stat-label">
                Test Drives
              </div>
            </div>

            <div className="bmw-cdb-stat-card">
              <div className="bmw-cdb-stat-val">
                {
                  testDrives.filter(
                    (item) => item.status === "CONFIRMED"
                  ).length
                }
              </div>
              <div className="bmw-cdb-stat-label">
                Confirmed Drives
              </div>
            </div>

            <div className="bmw-cdb-stat-card">
              <div className="bmw-cdb-stat-val">
                {quotations.length}
              </div>
              <div className="bmw-cdb-stat-label">
                Quotations
              </div>
            </div>
          </section>

          <section className="bmw-cdb-section">
            <h2 className="bmw-cdb-section-title">
              My Configurations
            </h2>

            {configurations.length === 0 ? (
              <div className="bmw-cdb-empty">
                You have no saved configurations yet.
              </div>
            ) : (
              <div className="bmw-cdb-config-grid">
                {configurations.map((config) => (
                  <article
                    className="bmw-cdb-config-card"
                    key={config._id}
                  >
                    <div>
                      <h3 className="bmw-cdb-config-title">
                        {config.carName}
                      </h3>

                      <div className="bmw-cdb-config-row">
                        <span>Color</span>
                        <strong>{config.color}</strong>
                      </div>

                      <div className="bmw-cdb-config-row">
                        <span>Wheels</span>
                        <strong>{config.wheel}</strong>
                      </div>

                      <div className="bmw-cdb-config-row">
                        <span>Interior</span>
                        <strong>{config.interior}</strong>
                      </div>

                      <div className="bmw-cdb-config-price">
                        ₹{config.finalPrice.toLocaleString("en-IN")}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="bmw-cdb-btn-delete"
                      onClick={() =>
                        handleDeleteConfiguration(config._id)
                      }
                    >
                      Delete Configuration
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="bmw-cdb-section">
            <h2 className="bmw-cdb-section-title">
              My Test Drives
            </h2>

            {testDrives.length === 0 ? (
              <div className="bmw-cdb-empty">
                You have no test drives booked.
              </div>
            ) : (
              <div className="bmw-cdb-test-list">
                {testDrives.map((td) => (
                  <article
                    className="bmw-cdb-test-card"
                    key={td._id}
                  >
                    <div className="bmw-cdb-test-top">
                      <h3 className="bmw-cdb-test-name">
                        {td.carName}
                      </h3>

                      <span className="bmw-cdb-status">
                        {td.status}
                      </span>
                    </div>

                    <div className="bmw-cdb-test-details">
                      <div>
                        <strong>Date: </strong>
                        {new Date(td.date).toLocaleDateString("en-IN")}
                      </div>

                      <div>
                        <strong>Time: </strong>
                        {td.time}
                      </div>

                      <div>
                        <strong>Location: </strong>
                        {td.location}
                      </div>

                      <div>
                        <strong>Mobile: </strong>
                        {td.mobile}
                      </div>

                      {td.notes && (
                        <div>
                          <strong>Notes: </strong>
                          {td.notes}
                        </div>
                      )}
                    </div>

                    {td.status !== "CANCELLED" &&
                      td.status !== "COMPLETED" && (
                        <button
                          type="button"
                          className="bmw-cdb-btn-delete"
                          onClick={() =>
                            handleCancelTestDrive(td._id)
                          }
                        >
                          Cancel Test Drive
                        </button>
                      )}
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="bmw-cdb-section">
            <h2 className="bmw-cdb-section-title">
              My Quotations
            </h2>

            {quotations.length === 0 ? (
              <div className="bmw-cdb-empty">
                You have no quotation requests yet.
              </div>
            ) : (
              <div className="bmw-cdb-quote-list">
                {quotations.map((quotation) => (
                  <article
                    className="bmw-cdb-quote-card"
                    key={quotation._id}
                  >
                    <div className="bmw-cdb-quote-top">
                      <div>
                        <h3 className="bmw-cdb-test-name">
                          {quotation.carName}
                        </h3>

                        <span
                          style={{
                            fontSize: "12px",
                            color: "#64748b",
                          }}
                        >
                          #{quotation.quotationNumber}
                        </span>
                      </div>

                      <span className="bmw-cdb-status">
                        {quotation.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="bmw-cdb-quote-pricing">
                      <div>
                        <span>Base Price</span>
                        <strong>
                          ₹{quotation.basePrice.toLocaleString("en-IN")}
                        </strong>
                      </div>

                      <div>
                        <span>Discount</span>
                        <strong>
                          ₹{quotation.discountAmount.toLocaleString("en-IN")}
                        </strong>
                      </div>

                      <div>
                        <span>Total</span>
                        <strong>
                          ₹{quotation.quotationTotal.toLocaleString("en-IN")}
                        </strong>
                      </div>
                    </div>

                    <div className="bmw-cdb-quote-footer">
                      <span>
                        Requested:{" "}
                        {new Date(
                          quotation.createdAt
                        ).toLocaleDateString("en-IN")}
                      </span>

                      {quotation.validUntil && (
                        <span>
                          Valid until:{" "}
                          {new Date(
                            quotation.validUntil
                          ).toLocaleDateString("en-IN")}
                        </span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </DashboardLayout>
  );
}