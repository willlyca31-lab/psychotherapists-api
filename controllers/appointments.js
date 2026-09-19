const { getDatabase } = require("../db/connect");

const collectionName = "appointments";

// Validate appointment data
function validateAppointment(data) {
  const requiredFields = [
    "psychotherapistId",
    "patientName",
    "appointmentDate",
    "appointmentTime",
    "status"
  ];

  for (const field of requiredFields) {
    if (
      data[field] === undefined ||
      data[field] === null ||
      data[field] === ""
    ) {
      return `${field} is required.`;
    }
  }

  // psychotherapistId must be a number
  if (typeof data.psychotherapistId !== "number") {
    return "psychotherapistId must be a number.";
  }

  // Other fields must be strings
  if (
    typeof data.patientName !== "string" ||
    typeof data.appointmentDate !== "string" ||
    typeof data.appointmentTime !== "string" ||
    typeof data.status !== "string"
  ) {
    return "patientName, appointmentDate, appointmentTime, and status must be strings.";
  }

  return null;
}


// GET all appointments
async function getAllAppointments(req, res) {
  try {
    const collection = getDatabase().collection(collectionName);

    const appointments = await collection.find({}).toArray();

    res.status(200).json(appointments);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to retrieve appointments."
    });
  }
}


// GET one appointment by ID
// Example: /appointments?id=2884858585858
async function getAppointmentById(req, res) {
  try {
    const id = Number(req.query.id);

    if (!req.query.id || Number.isNaN(id)) {
      return res.status(400).json({
        error: "A valid numeric id query parameter is required."
      });
    }

    const collection = getDatabase().collection(collectionName);

    const appointment = await collection.findOne({ id });

    if (!appointment) {
      return res.status(404).json({
        error: "Appointment not found."
      });
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to retrieve appointment."
    });
  }
}


// POST - Create a new appointment
async function createAppointment(req, res) {
  try {
    const appointment = req.body;

    // Validate the submitted data
    const validationError = validateAppointment(appointment);

    if (validationError) {
      return res.status(400).json({
        error: validationError
      });
    }

    const collection = getDatabase().collection(collectionName);

    // Create a unique numeric ID
    const newAppointment = {
      id: Date.now(),
      psychotherapistId: appointment.psychotherapistId,
      patientName: appointment.patientName,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      status: appointment.status
    };

    await collection.insertOne(newAppointment);

    res.status(201).json(newAppointment);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to create appointment."
    });
  }
}


// PUT - Update an existing appointment
// Example: PUT /appointments/2884858585858
async function updateAppointment(req, res) {
  try {
    const id = Number(req.params.id);

    if (!req.params.id || Number.isNaN(id)) {
      return res.status(400).json({
        error: "A valid numeric id is required."
      });
    }

    // Validate the submitted data
    const validationError = validateAppointment(req.body);

    if (validationError) {
      return res.status(400).json({
        error: validationError
      });
    }

    const collection = getDatabase().collection(collectionName);

    const updatedAppointment = {
      psychotherapistId: req.body.psychotherapistId,
      patientName: req.body.patientName,
      appointmentDate: req.body.appointmentDate,
      appointmentTime: req.body.appointmentTime,
      status: req.body.status
    };

    const result = await collection.updateOne(
      { id },
      { $set: updatedAppointment }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        error: "Appointment not found."
      });
    }

    const appointment = await collection.findOne({ id });

    res.status(200).json(appointment);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to update appointment."
    });
  }
}


// DELETE - Delete an appointment
// Example: DELETE /appointments/2884858585858
async function deleteAppointment(req, res) {
  try {
    const id = Number(req.params.id);

    if (!req.params.id || Number.isNaN(id)) {
      return res.status(400).json({
        error: "A valid numeric id is required."
      });
    }

    const collection = getDatabase().collection(collectionName);

    const result = await collection.deleteOne({ id });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        error: "Appointment not found."
      });
    }

    res.status(200).json({
      message: "Appointment deleted successfully."
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to delete appointment."
    });
  }
}


module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment
};