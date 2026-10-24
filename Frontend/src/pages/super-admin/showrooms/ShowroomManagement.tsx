//D:\D-Luxury-Car-Showroom\Frontend\src\pages\super-admin\showrooms\ShowroomManagement.tsx
import { useCallback, useEffect, useState } from "react";

import {
  createShowroom,
  deleteShowroom,
  getManagementShowrooms,
  updateShowroom,
  updateShowroomStatus,
  type Showroom,
  type ShowroomPayload,
} from "../../../api/showroom-management.api";

import ShowroomForm from "../../super-admin/showrooms/ShowroomForm";

import "../../../styles/pages/super-admin/showrooms/ShowroomManagement.css";

function ShowroomManagement() {
  const [showrooms, setShowrooms] = useState<Showroom[]>([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingShowroom, setEditingShowroom] =
    useState<Showroom | null>(null);

  const loadShowrooms = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getManagementShowrooms(
        page,
        10,
        search.trim()
      );

      setShowrooms(result.showrooms);
      setTotal(result.pagination.total);
      setTotalPages(
        Math.max(1, result.pagination.totalPages)
      );
    } catch {
      setError(
        "Showrooms could not be loaded. Check your login and API connection."
      );
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadShowrooms();
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [loadShowrooms]);

  const openCreateForm = () => {
    setEditingShowroom(null);
    setShowForm(true);
    setError("");
    setNotice("");
  };

  const openEditForm = (showroom: Showroom) => {
    setEditingShowroom(showroom);
    setShowForm(true);
    setError("");
    setNotice("");
  };

  const handleSave = async (
    payload: ShowroomPayload
  ) => {
    setSubmitting(true);
    setError("");
    setNotice("");

    try {
      if (editingShowroom) {
        await updateShowroom(
          editingShowroom._id,
          payload
        );

        setNotice("Showroom updated successfully.");
      } else {
        await createShowroom(payload);

        setPage(1);
        setNotice("Showroom created successfully.");
      }

      setShowForm(false);
      setEditingShowroom(null);

      const result = await getManagementShowrooms(
        editingShowroom ? page : 1,
        10,
        search.trim()
      );

      setShowrooms(result.showrooms);
      setTotal(result.pagination.total);
      setTotalPages(
        Math.max(1, result.pagination.totalPages)
      );

      if (!editingShowroom) {
        setPage(1);
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to save showroom.";

      throw new Error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (
    showroom: Showroom
  ) => {
    const nextStatus = !showroom.isActive;

    const confirmed = window.confirm(
      `Are you sure you want to ${
        nextStatus ? "activate" : "deactivate"
      } ${showroom.name}?`
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      await updateShowroomStatus(
        showroom._id,
        nextStatus
      );

      setNotice(
        `${showroom.name} is now ${
          nextStatus ? "active" : "inactive"
        }.`
      );

      await loadShowrooms();
    } catch {
      setError("Unable to update showroom status.");
    }
  };

  const handleDelete = async (showroom: Showroom) => {
    const confirmed = window.confirm(
      `Permanently delete "${showroom.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      await deleteShowroom(showroom._id);

      setNotice("Showroom deleted successfully.");

      if (showrooms.length === 1 && page > 1) {
        setPage((previous) => previous - 1);
      } else {
        await loadShowrooms();
      }
    } catch {
      setError("Unable to delete showroom.");
    }
  };

  return (
    <main className="showroom-management">
      <header className="showroom-management__header">
        <div>
          <span className="showroom-management__eyebrow">
            ADMINISTRATION
          </span>

          <h1>Showroom Management</h1>

          <p>
            Manage showroom branches, contact information
            and operating hours.
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            className="showroom-management__add"
            onClick={openCreateForm}
          >
            + Add Showroom
          </button>
        )}
      </header>

      {notice && (
        <div className="showroom-management__notice">
          {notice}
        </div>
      )}

      {error && (
        <div className="showroom-management__error">
          {error}
        </div>
      )}

      {showForm ? (
        <section className="showroom-management__form-panel">
          <div className="showroom-management__form-heading">
            <div>
              <h2>
                {editingShowroom
                  ? "Edit Showroom"
                  : "Create Showroom"}
              </h2>

              <p>
                Fields marked with * are required.
              </p>
            </div>
          </div>

          <ShowroomForm
            key={editingShowroom?._id ?? "new-showroom"}
            initialData={editingShowroom}
            submitting={submitting}
            onSubmit={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingShowroom(null);
            }}
          />
        </section>
      ) : (
        <>
          <section className="showroom-management__stats">
            <div>
              <span>Total Branches</span>
              <strong>{total}</strong>
            </div>

            <div>
              <span>Active on This Page</span>
              <strong>
                {
                  showrooms.filter(
                    (showroom) => showroom.isActive
                  ).length
                }
              </strong>
            </div>

            <div>
              <span>Inactive on This Page</span>
              <strong>
                {
                  showrooms.filter(
                    (showroom) => !showroom.isActive
                  ).length
                }
              </strong>
            </div>
          </section>

          <section className="showroom-management__table-panel">
            <div className="showroom-management__toolbar">
              <h2>All Showrooms</h2>

              <input
                type="search"
                value={search}
                placeholder="Search name, city or branch code..."
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
              />
            </div>

            {loading ? (
              <div className="showroom-management__state">
                Loading showrooms...
              </div>
            ) : showrooms.length === 0 ? (
              <div className="showroom-management__state">
                <h3>No showrooms found</h3>

                <p>
                  Add a showroom or try a different search.
                </p>
              </div>
            ) : (
              <div className="showroom-management__table-wrap">
                <table className="showroom-management__table">
                  <thead>
                    <tr>
                      <th>Showroom</th>
                      <th>Branch Code</th>
                      <th>Location</th>
                      <th>Contact</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {showrooms.map((showroom) => (
                      <tr key={showroom._id}>
                        <td>
                          <div className="showroom-management__name">
                            {showroom.name}
                          </div>

                          <div className="showroom-management__slug">
                            /{showroom.slug}
                          </div>
                        </td>

                        <td>{showroom.branchCode}</td>

                        <td>
                          {showroom.city}, {showroom.state}
                          <div className="showroom-management__muted">
                            {showroom.postalCode}
                          </div>
                        </td>

                        <td>
                          <a
                            href={`mailto:${showroom.email}`}
                          >
                            {showroom.email}
                          </a>

                          <div className="showroom-management__muted">
                            {showroom.phoneNumbers[0] ?? "—"}
                          </div>
                        </td>

                        <td>
                          <span
                            className={
                              showroom.isActive
                                ? "showroom-status showroom-status--active"
                                : "showroom-status showroom-status--inactive"
                            }
                          >
                            {showroom.isActive
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </td>

                        <td>
                          <div className="showroom-management__actions">
                            <button
                              type="button"
                              onClick={() =>
                                openEditForm(showroom)
                              }
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                void handleToggleStatus(
                                  showroom
                                )
                              }
                            >
                              {showroom.isActive
                                ? "Deactivate"
                                : "Activate"}
                            </button>

                            <button
                              type="button"
                              className="showroom-management__delete"
                              onClick={() =>
                                void handleDelete(showroom)
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <footer className="showroom-management__pagination">
              <span>
                Page {page} of {totalPages}
              </span>

              <div>
                <button
                  type="button"
                  disabled={page <= 1 || loading}
                  onClick={() =>
                    setPage((previous) =>
                      Math.max(1, previous - 1)
                    )
                  }
                >
                  Previous
                </button>

                <button
                  type="button"
                  disabled={
                    page >= totalPages || loading
                  }
                  onClick={() =>
                    setPage((previous) =>
                      Math.min(totalPages, previous + 1)
                    )
                  }
                >
                  Next
                </button>
              </div>
            </footer>
          </section>
        </>
      )}
    </main>
  );
}

export default ShowroomManagement;