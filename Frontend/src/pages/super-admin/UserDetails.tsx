import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getUserOverview,
} from "../../api/userOverview.api";

import type {
  UserOverview,
} from "../../api/userOverview.api";

import "../../styles/pages/super-admin/UserDetails.css";

type Tab =
  | "OVERVIEW"
  | "CONFIGURATIONS"
  | "TEST_DRIVES"
  | "QUOTATIONS";

export default function UserDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [overview, setOverview] =
    useState<UserOverview | null>(null);

  const [activeTab, setActiveTab] =
    useState<Tab>("OVERVIEW");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadOverview() {
      if (!id) {
        setError("User ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const result = await getUserOverview(id);

        if (active) {
          setOverview(result);
        }
      } catch (err: unknown) {
        const apiError = err as {
          response?: {
            data?: {
              message?: string;
            };
          };
        };

        if (active) {
          setError(
            apiError.response?.data?.message ||
              "Unable to load user details.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadOverview();

    return () => {
      active = false;
    };
  }, [id]);

  function formatDate(value?: string) {
    if (!value) {
      return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  }

  if (loading) {
    return (
      <main className="user-details">
        <div className="user-details__message">
          Loading user details...
        </div>
      </main>
    );
  }

  if (error || !overview) {
    return (
      <main className="user-details">
        <button
          type="button"
          className="user-details__back"
          onClick={() =>
            navigate("/super-admin/users")
          }
        >
          ← Back to Users
        </button>

        <div
          className="user-details__error"
          role="alert"
        >
          {error || "User not found."}
        </div>
      </main>
    );
  }

  const { user, summary } = overview;

  return (
    <main className="user-details">
      <header className="user-details__header">
        <div>
          <p className="user-details__eyebrow">
            LUXORA AUTOMOTIVE / USER MANAGEMENT
          </p>

          <h1>User Details</h1>

          <p>
            View this account and its showroom activity.
          </p>
        </div>

        <button
          type="button"
          className="user-details__back"
          onClick={() =>
            navigate("/super-admin/users")
          }
        >
          ← All Users
        </button>
      </header>

      <section className="user-details__profile">
        <div className="user-details__avatar">
          {user.fullName
            .trim()
            .charAt(0)
            .toUpperCase()}
        </div>

        <div className="user-details__identity">
          <h2>{user.fullName}</h2>

          <p>{user.email}</p>

          <div className="user-details__badges">
            <span className="user-details__role">
              {user.role.replace("_", " ")}
            </span>

            <span
              className={
                user.isActive
                  ? "user-details__status user-details__status--active"
                  : "user-details__status user-details__status--inactive"
              }
            >
              {user.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </section>

      <section className="user-details__stats">
        <button
          type="button"
          onClick={() => setActiveTab("CONFIGURATIONS")}
        >
          <span>Configurations</span>
          <strong>{summary.configurations}</strong>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("TEST_DRIVES")}
        >
          <span>Test Drives</span>
          <strong>{summary.testDrives}</strong>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("QUOTATIONS")}
        >
          <span>Quotations</span>
          <strong>{summary.quotations}</strong>
        </button>
      </section>

      <nav className="user-details__tabs">
        {(
          [
            ["OVERVIEW", "Profile"],
            ["CONFIGURATIONS", "Configurations"],
            ["TEST_DRIVES", "Test Drives"],
            ["QUOTATIONS", "Quotations"],
          ] as const
        ).map(([tab, label]) => (
          <button
            key={tab}
            type="button"
            className={
              activeTab === tab
                ? "user-details__tab user-details__tab--active"
                : "user-details__tab"
            }
            onClick={() => setActiveTab(tab)}
          >
            {label}
          </button>
        ))}
      </nav>

      {activeTab === "OVERVIEW" && (
        <section className="user-details__panel">
          <h3>Account Information</h3>

          <div className="user-details__info-grid">
            <div>
              <span>Full Name</span>
              <strong>{user.fullName}</strong>
            </div>

            <div>
              <span>Email</span>
              <strong>{user.email}</strong>
            </div>

            <div>
              <span>Role</span>
              <strong>{user.role.replace("_", " ")}</strong>
            </div>

            <div>
              <span>Account Status</span>
              <strong>
                {user.isActive ? "Active" : "Inactive"}
              </strong>
            </div>

            <div>
              <span>Registered On</span>
              <strong>{formatDate(user.createdAt)}</strong>
            </div>

            <div>
              <span>Last Updated</span>
              <strong>{formatDate(user.updatedAt)}</strong>
            </div>
          </div>
        </section>
      )}

      {activeTab === "CONFIGURATIONS" && (
        <section className="user-details__panel">
          <h3>Saved Car Configurations</h3>

          {overview.configurations.length === 0 ? (
            <p className="user-details__empty">
              This user has no saved configurations.
            </p>
          ) : (
            <div className="user-details__record-list">
              {overview.configurations.map((item) => (
                <article
                  className="user-details__record"
                  key={item._id}
                >
                  <div>
                    <h4>{item.carName}</h4>

                    <p>
                      {item.color} · {item.wheel} ·{" "}
                      {item.interior}
                    </p>

                    <span>
                      Saved {formatDate(item.createdAt)}
                    </span>
                  </div>

                  <div className="user-details__record-price">
                    <strong>
                      {formatCurrency(item.finalPrice)}
                    </strong>

                    <span>{item.status}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === "TEST_DRIVES" && (
        <section className="user-details__panel">
          <h3>Test Drive Bookings</h3>

          {overview.testDrives.length === 0 ? (
            <p className="user-details__empty">
              This user has no test-drive bookings.
            </p>
          ) : (
            <div className="user-details__record-list">
              {overview.testDrives.map((item) => (
                <article
                  className="user-details__record"
                  key={item._id}
                >
                  <div>
                    <h4>{item.carName}</h4>

                    <p>
                      {formatDate(item.date)} at {item.time}
                    </p>

                    <span>
                      {item.location}
                    </span>
                  </div>

                  <span className="user-details__record-status">
                    {item.status}
                  </span>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === "QUOTATIONS" && (
        <section className="user-details__panel">
          <h3>Customer Quotations</h3>

          {overview.quotations.length === 0 ? (
            <p className="user-details__empty">
              This user has no quotations.
            </p>
          ) : (
            <div className="user-details__record-list">
              {overview.quotations.map((item) => (
                <article
                  className="user-details__record"
                  key={item._id}
                >
                  <div>
                    <h4>{item.carName}</h4>

                    <p>{item.quotationNumber}</p>

                    <span>
                      Created {formatDate(item.createdAt)}
                    </span>
                  </div>

                  <div className="user-details__record-price">
                    <strong>
                      {formatCurrency(item.quotationTotal)}
                    </strong>

                    <span>{item.status}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}