const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;
let nextId = 1;
let appointments = [];

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/api/appointments", (req, res) => {
  res.json(appointments);
});

app.post("/api/appointments", (req, res) => {
  const { patientName, email, phone, date, time, dentist, notes } = req.body;

  if (!patientName || !email || !phone || !date || !time || !dentist) {
    return res.status(400).json({
      error:
        "Missing required fields: patientName, email, phone, date, time, dentist",
    });
  }
app.delete("/api/appointments/:id", (req, res) => {
  const id = Number(req.params.id);
  appointments = appointments.filter((appointment) => appointment.id !== id);
  res.json({ message: "Appointment deleted successfully" });
});
  const appointment = {
    id: nextId++,
    patientName,
    email,
    phone,
    date,
    time,
    dentist,
    notes: notes || "",
    createdAt: new Date().toISOString(),
  };

  appointments.push(appointment);
  return res.status(201).json(appointment);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});