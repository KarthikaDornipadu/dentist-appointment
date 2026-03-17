const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let appointments = [];

app.get("/api/appointments", (req, res) => {
  res.json(appointments);
});

app.post("/api/appointments", (req, res) => {
  const newAppointment = {
    id: Date.now(),
    name: req.body.name,
  };
  appointments.push(newAppointment);
  res.json(newAppointment);
});

app.delete("/api/appointments/:id", (req, res) => {
  const id = req.params.id;
  appointments = appointments.filter((a) => a.id != id);
  res.json({ message: "Deleted" });
});

app.get("/", (req, res) => {
  res.send("API running");
});

app.listen(5000, () => {
  console.log("Server running");
});