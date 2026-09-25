const express = require("express");

const router = express.Router();

const { isLoggedIn } = require("../middleware/auth");

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

// POST - Create a new appointment (requires GitHub login)
// Example: POST /appointments
router.post("/", isLoggedIn, createAppointment);

// PUT - Update an appointment (requires GitHub login)
// Example: PUT /appointments/2884858585858
router.put("/:id", isLoggedIn, updateAppointment);

// DELETE - Delete an appointment (requires GitHub login)
// Example: DELETE /appointments/2884858585858
router.delete("/:id", isLoggedIn, deleteAppointment);

module.exports = router;
