import { useEffect, useState } from "react";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_URL || "https://dentist-appointment-8qf8.onrender.com";

const initialForm = {
  patientName: "",
  email: "",
  phone: "",
  date: "",
  time: "",
  dentist: "Dr. Rivera",
  notes: "",
};

function App() {
  const [form, setForm] = useState(initialForm);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadAppointments() {
    try {
      setError("");
      const response = await fetch(`${API_BASE}/api/appointments`);
      if (!response.ok) {
        throw new Error("Failed to load appointments.");
      }
      const data = await response.json();
      setAppointments(data);
    } catch (loadError) {
      setError(loadError.message || "Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  function onFieldChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE}/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error || "Could not book appointment.");
      }

      const created = await response.json();
      setAppointments((prev) => [created, ...prev]);
      setForm(initialForm);
      setSuccess("Appointment booked successfully.");
    } catch (submitError) {
      setError(submitError.message || "Unexpected error.");
    } finally {
      setSubmitting(false);
    }
  }

  const handleDelete = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/appointments/${id}`, {
        method: "DELETE",
      });

      setAppointments((prev) =>
        prev.filter((appointment) => appointment.id !== id)
      );
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };
  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">Blue Harbor Dental</p>
        <h1>Book a Dentist Appointment</h1>
        <p className="subtitle">
          Reserve your preferred date and dentist in under a minute.
        </p>
      </section>

      <section className="layout-grid">
        <article className="panel form-panel">
          <h2>New Appointment</h2>

          <form onSubmit={onSubmit} className="booking-form">
            <label>
              Full Name
              <input
                name="patientName"
                value={form.patientName}
                onChange={onFieldChange}
                required
                placeholder="Alex Johnson"
              />
            </label>

            <label>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onFieldChange}
                required
                placeholder="alex@email.com"
              />
            </label>

            <label>
              Phone
              <input
                name="phone"
                value={form.phone}
                onChange={onFieldChange}
                required
                placeholder="+1 555 0100"
              />
            </label>

            <div className="two-col">
              <label>
                Date
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={onFieldChange}
                  required
                />
              </label>

              <label>
                Time
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={onFieldChange}
                  required
                />
              </label>
            </div>

            <label>
              Dentist
              <select
                name="dentist"
                value={form.dentist}
                onChange={onFieldChange}
                required
              >
                <option>Dr. Rivera</option>
                <option>Dr. Collins</option>
                <option>Dr. Gupta</option>
              </select>
            </label>

            <label>
              Notes
              <textarea
                name="notes"
                value={form.notes}
                onChange={onFieldChange}
                rows={3}
                placeholder="Any pain, sensitivity, or specific concern"
              />
            </label>

            <button disabled={submitting} type="submit">
              {submitting ? "Booking..." : "Book Appointment"}
            </button>
          </form>

          {success && <p className="notice success">{success}</p>}
          {error && <p className="notice error">{error}</p>}
        </article>

        <article className="panel list-panel">
          <h2>Scheduled Appointments</h2>
          {loading ? (
            <p className="muted">Loading appointments...</p>
          ) : appointments.length === 0 ? (
            <p className="muted">No appointments yet.</p>
          ) : (
            <ul className="appointment-list">
              {appointments.map((item) => (
                <li key={item.id} className="appointment-item">
                  <div>
                    <h3>{item.patientName}</h3>
                    <p>
                      {item.date} at {item.time}
                    </p>
                    <p>{item.dentist}</p>
                   <button
  onClick={() => handleDelete(item.id)}
  style={{
    border: "1px solid #dc2626",
    padding: "6px 14px",
    borderRadius: "8px",
    backgroundColor: "#fff",
    color: "#dc2626",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "8px"
  }}
>
  Delete
</button>
                  </div>
                  <div className="contact">
                    <p>{item.email}</p>
                    <p>{item.phone}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>
    </main>
  );
}

export default App;