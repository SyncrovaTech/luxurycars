//D:\D-Luxury-Car-Showroom\Frontend\src\pages\admin\QuotationManagement.tsx
import { useEffect, useState } from "react";
import { getAllQuotations, updateQuotation } from "../../api/adminQuotations.api";
import type { Quotation } from "../../api/quotations.api";
import "../../styles/pages/admin/QuotationManagement.css";

export default function QuotationManagement() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  async function loadQuotations() {
    try {
      setLoading(true);
      const data = await getAllQuotations();
      setQuotations(data);
    } catch (error) {
      console.error("Unable to load quotations", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuotations();
  }, []);

  async function handleStatus(
    quotation: Quotation,
    status: Quotation["status"]
  ) {
    try {
      setUpdating(quotation._id);
      const response = await updateQuotation(quotation._id, { status });

      setQuotations((previous) =>
        previous.map((item) =>
          item._id === quotation._id ? response.data : item
        )
      );
    } catch (error) {
      console.error("Unable to update quotation", error);
      alert("Unable to update quotation.");
    } finally {
      setUpdating(null);
    }
  }

  if (loading) {
    return (
      <div className="bmw-qtm-wrapper">
        <div className="bmw-qtm-loading">Loading quotations...</div>
      </div>
    );
  }

  return (
    <section className="bmw-qtm-wrapper">
      <div className="bmw-qtm-header">
        <div>
          <h1 className="bmw-qtm-header__title">Quotation Management</h1>
          <p className="bmw-qtm-header__subtitle">
            Review and manage customer quotation requests.
          </p>
        </div>

        <div className="bmw-qtm-counter">
          {quotations.length}
          <span>Requests</span>
        </div>
      </div>

      {quotations.length === 0 ? (
        <div className="bmw-qtm-empty">No quotation requests found.</div>
      ) : (
        <div className="bmw-qtm-list">
          {quotations.map((quotation) => (
            <article className="bmw-qtm-card" key={quotation._id}>
              <div className="bmw-qtm-card__top">
                <div>
                  <h2 className="bmw-qtm-card__car-name">{quotation.carName}</h2>
                  <p className="bmw-qtm-card__number">
                    #{quotation.quotationNumber}
                  </p>
                </div>

                <span
                  className={`bmw-qtm-status bmw-qtm-status--${quotation.status.toLowerCase()}`}
                >
                  {quotation.status.replace("_", " ")}
                </span>
              </div>

              {/* Customer Details */}
              <div className="bmw-qtm-meta-grid">
                <div className="bmw-qtm-meta-col">
                  <span>Customer</span>
                  <strong>{quotation.customerName}</strong>
                </div>

                <div className="bmw-qtm-meta-col">
                  <span>Email</span>
                  <strong>{quotation.customerEmail}</strong>
                </div>

                {/* <div className="bmw-qtm-meta-col">
                  <span>Mobile</span>
                  <strong>{quotation.customerMobile}</strong>
                </div> */}
              </div>

              {/* Vehicle Specifications */}
              <div className="bmw-qtm-meta-grid">
                <div className="bmw-qtm-meta-col">
                  <span>Color</span>
                  <strong>{quotation.color}</strong>
                </div>

                <div className="bmw-qtm-meta-col">
                  <span>Wheel Type</span>
                  <strong>{quotation.wheel}</strong>
                </div>

                <div className="bmw-qtm-meta-col">
                  <span>Interior</span>
                  <strong>{quotation.interior}</strong>
                </div>
              </div>

              {/* Total & Action Buttons */}
              <div className="bmw-qtm-price-row">
                <div className="bmw-qtm-price-tag">
                  <small>Total Estimated Price</small>₹
                  {quotation.quotationTotal.toLocaleString("en-IN")}
                </div>

                <div className="bmw-qtm-actions">
                  <button
                    type="button"
                    className="bmw-qtm-btn bmw-qtm-btn--review"
                    disabled={updating === quotation._id}
                    onClick={() => handleStatus(quotation, "UNDER_REVIEW")}
                  >
                    Review
                  </button>

                  <button
                    type="button"
                    className="bmw-qtm-btn bmw-qtm-btn--approve"
                    disabled={updating === quotation._id}
                    onClick={() => handleStatus(quotation, "APPROVED")}
                  >
                    Approve
                  </button>

                  <button
                    type="button"
                    className="bmw-qtm-btn bmw-qtm-btn--reject"
                    disabled={updating === quotation._id}
                    onClick={() => handleStatus(quotation, "REJECTED")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}