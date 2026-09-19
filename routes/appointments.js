const express = require("express");

const router = express.Router();

const {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment
} = require("../controllers/appointments");

// GET all appointments
// Example: GET /appointments
router.get("/", getAllAppointments);

// GET one appointment by ID
// Example: GET /appointments/by-id?id=2884858585858
router.get("/by-id", getAppointmentById);

// POST - Create a new appointment
// Example: POST /appointments
router.post("/", createAppointment);

// PUT - Update an appointment
// Example: PUT /appointments/2884858585858
router.put("/:id", updateAppointment);

// DELETE - Delete an appointment
// Example: DELETE /appointments/2884858585858
router.delete("/:id", deleteAppointment);

module.exports = router;