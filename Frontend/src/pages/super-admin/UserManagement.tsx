//D:\D-Luxury-Car-Showroom\Frontend\src\pages\super-admin\UserManagement.tsx
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  getAllUsers,
  updateManagedUserRole,
  updateManagedUserStatus,
} from "../../api/users.api";

import type {
  ManagedUser,
  UsersPagination,
} from "../../api/users.api";

import type {
  UserRole,
} from "../../api/auth.api";

import "../../styles/pages/super-admin/UserManagement.css";

const USER_ROLES: UserRole[] = [
  "CUSTOMER",
  "MANAGER",
  "ADMIN",
  "SUPER_ADMIN",
];

export default function UserManagement() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<ManagedUser[]>([]);

  const [pagination, setPagination] =
    useState<UsersPagination>({
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    });

  const [search, setSearch] = useState("");

  const [role, setRole] = useState<UserRole | "">("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [actionUserId, setActionUserId] =
    useState<string | null>(null);

  const [notice, setNotice] = useState("");

  const loadUsers = useCallback(
    async (
      page = 1,
      currentSearch = search,
      currentRole = role,
    ) => {
      try {
        setLoading(true);
        setError("");
        setNotice("");

        const result = await getAllUsers({
          page,
          limit: 10,
          search: currentSearch.trim() || undefined,
          role: currentRole || undefined,
        });

        setUsers(result.data);

        setPagination(result.pagination);
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
            "Unable to load users.",
        );
      } finally {
        setLoading(false);
      }
    },
    [search, role],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadUsers(1, search, role);
    }, 250);

    return () => {
      window.clearTimeout(timer);
    };
  }, [search, role, loadUsers]);

  async function handleRoleChange(
    user: ManagedUser,
    newRole: UserRole,
  ) {
    if (user.role === newRole) {
      return;
    }

    const confirmed = window.confirm(
      `Change ${user.fullName}'s role from ${user.role} to ${newRole}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionUserId(user.id);
      setError("");
      setNotice("");

      await updateManagedUserRole(
        user.id,
        newRole,
      );

      setNotice(
        `${user.fullName}'s role was updated successfully.`,
      );

      await loadUsers(pagination.page);
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
          "Unable to update user role.",
      );
    } finally {
      setActionUserId(null);
    }
  }

  async function handleStatusChange(
    user: ManagedUser,
  ) {
    const nextStatus = !user.isActive;

    const confirmed = window.confirm(
      nextStatus
        ? `Activate ${user.fullName}'s account?`
        : `Deactivate ${user.fullName}'s account?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionUserId(user.id);
      setError("");
      setNotice("");

      await updateManagedUserStatus(
        user.id,
        nextStatus,
      );

      setNotice(
        `${user.fullName}'s account status was updated.`,
      );

      await loadUsers(pagination.page);
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
          "Unable to update account status.",
      );
    } finally {
      setActionUserId(null);
    }
  }

  function formatDate(date: string) {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      },
    );
  }

  return (
    <main className="user-management">
      <header className="user-management__header">
        <div>
          <p className="user-management__eyebrow">
            LUXORA AUTOMOTIVE
          </p>

          <h1>User Management</h1>

          <p>
            Manage showroom accounts, roles and access.
          </p>
        </div>

        <button
          type="button"
          className="user-management__back"
          onClick={() =>
            navigate("/super-admin/dashboard")
          }
        >
          ← Dashboard
        </button>
      </header>

      <section className="user-management__stats">
        <article className="user-management__stat">
          <span>Total Users</span>
          <strong>{pagination.total}</strong>
        </article>

        <article className="user-management__stat">
          <span>Current Page</span>
          <strong>{pagination.page}</strong>
        </article>

        <article className="user-management__stat">
          <span>Total Pages</span>
          <strong>{pagination.totalPages}</strong>
        </article>
      </section>

      <section className="user-management__panel">
        <div className="user-management__toolbar">
          <label className="user-management__search">
            <span>Search users</span>

            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
              }}
              placeholder="Search by name or email..."
            />
          </label>

          <label className="user-management__filter">
            <span>Filter by role</span>

            <select
              value={role}
              onChange={(event) => {
                setRole(
                  event.target.value as UserRole | "",
                );
              }}
            >
              <option value="">All Roles</option>

              {USER_ROLES.map((userRole) => (
                <option
                  key={userRole}
                  value={userRole}
                >
                  {userRole.replace("_", " ")}
                </option>
              ))}
            </select>
          </label>
        </div>

        {notice && (
          <div
            className="user-management__notice"
            role="status"
          >
            {notice}
          </div>
        )}

        {error && (
          <div
            className="user-management__error"
            role="alert"
          >
            {error}
          </div>
        )}

        {loading ? (
          <div className="user-management__empty">
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="user-management__empty">
            <h3>No users found</h3>

            <p>
              Try changing the search term or role filter.
            </p>
          </div>
        ) : (
          <>
            <div className="user-management__table-wrapper">
              <table className="user-management__table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Registered</th>
                    <th>Manage</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-management__identity">
                          <span className="user-management__avatar">
                            {user.fullName
                              .trim()
                              .charAt(0)
                              .toUpperCase()}
                          </span>

                          <div>
                            <strong>
                              {user.fullName}
                            </strong>

                            <span>
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span
                          className={`user-management__role user-management__role--${user.role.toLowerCase()}`}
                        >
                          {user.role.replace("_", " ")}
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            user.isActive
                              ? "user-management__status user-management__status--active"
                              : "user-management__status user-management__status--inactive"
                          }
                        >
                          {user.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td>
                        {formatDate(user.createdAt)}
                      </td>

                      <td>
                        <div className="user-management__actions">
                          <button
                            type="button"
                            className="user-management__details"
                            onClick={() =>
                              navigate(
                                `/super-admin/users/${user.id}`,
                              )
                            }
                          >
                            Details
                          </button>

                          <select
                            aria-label={`Change role for ${user.fullName}`}
                            value={user.role}
                            disabled={
                              actionUserId === user.id
                            }
                            onChange={(event) => {
                              void handleRoleChange(
                                user,
                                event.target.value as UserRole,
                              );
                            }}
                          >
                            {USER_ROLES.map(
                              (userRole) => (
                                <option
                                  key={userRole}
                                  value={userRole}
                                >
                                  {userRole.replace("_", " ")}
                                </option>
                              ),
                            )}
                          </select>

                          <button
                            type="button"
                            className={
                              user.isActive
                                ? "user-management__deactivate"
                                : "user-management__activate"
                            }
                            disabled={
                              actionUserId === user.id
                            }
                            onClick={() => {
                              void handleStatusChange(user);
                            }}
                          >
                            {actionUserId === user.id
                              ? "Saving..."
                              : user.isActive
                                ? "Deactivate"
                                : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="user-management__pagination">
              <span>
                Page {pagination.page} of{" "}
                {pagination.totalPages}
              </span>

              <div>
                <button
                  type="button"
                  disabled={
                    pagination.page <= 1 || loading
                  }
                  onClick={() =>
                    void loadUsers(pagination.page - 1)
                  }
                >
                  Previous
                </button>

                <button
                  type="button"
                  disabled={
                    pagination.page >=
                      pagination.totalPages ||
                    loading
                  }
                  onClick={() =>
                    void loadUsers(pagination.page + 1)
                  }
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}