const { getDatabase } = require("../db/connect");

const collectionName = "psychotherapists";

// Validate psychotherapist data
function validatePsychotherapist(data) {
  const requiredFields = [
    "firstName",
    "lastName",
    "email",
    "specialty",
    "therapyApproach",
    "yearsOfExperience",
    "city",
    "country"
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

  if (typeof data.yearsOfExperience !== "number") {
    return "yearsOfExperience must be a number.";
  }

  return null;
}


// GET all psychotherapists
async function getAllPsychotherapists(req, res) {
  try {
    const collection = getDatabase().collection(collectionName);

    const psychotherapists = await collection.find({}).toArray();

    res.status(200).json(psychotherapists);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to retrieve psychotherapists."
    });
  }
}


// GET one psychotherapist by ID
async function getPsychotherapistById(req, res) {
  try {
    const id = Number(req.query.id);

    if (!req.query.id || Number.isNaN(id)) {
      return res.status(400).json({
        error: "A valid numeric id query parameter is required."
      });
    }

    const collection = getDatabase().collection(collectionName);

    const psychotherapist = await collection.findOne({ id });

    if (!psychotherapist) {
      return res.status(404).json({
        error: "Psychotherapist not found."
      });
    }

    res.status(200).json(psychotherapist);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to retrieve psychotherapist."
    });
  }
}


// POST - Create a new psychotherapist
async function createPsychotherapist(req, res) {
  try {
    const psychotherapist = req.body;

    // Validate the submitted data
    const validationError = validatePsychotherapist(psychotherapist);

    if (validationError) {
      return res.status(400).json({
        error: validationError
      });
    }

    const collection = getDatabase().collection(collectionName);

    // Create a unique numeric ID
    const newPsychotherapist = {
      id: Date.now(),
      firstName: psychotherapist.firstName,
      lastName: psychotherapist.lastName,
      email: psychotherapist.email,
      specialty: psychotherapist.specialty,
      therapyApproach: psychotherapist.therapyApproach,
      yearsOfExperience: psychotherapist.yearsOfExperience,
      city: psychotherapist.city,
      country: psychotherapist.country
    };

    await collection.insertOne(newPsychotherapist);

    res.status(201).json(newPsychotherapist);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to create psychotherapist."
    });
  }
}


// PUT - Update an existing psychotherapist
async function updatePsychotherapist(req, res) {
  try {
    const id = Number(req.params.id);

    // Check that the ID is valid
    if (!req.params.id || Number.isNaN(id)) {
      return res.status(400).json({
        error: "A valid numeric id is required."
      });
    }

    // Validate the submitted data
    const validationError = validatePsychotherapist(req.body);

    if (validationError) {
      return res.status(400).json({
        error: validationError
      });
    }

    const collection = getDatabase().collection(collectionName);

    // Update the psychotherapist
    const updatedPsychotherapist = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      specialty: req.body.specialty,
      therapyApproach: req.body.therapyApproach,
      yearsOfExperience: req.body.yearsOfExperience,
      city: req.body.city,
      country: req.body.country
    };

    const result = await collection.updateOne(
      { id },
      { $set: updatedPsychotherapist }
    );

    // If no record was found
    if (result.matchedCount === 0) {
      return res.status(404).json({
        error: "Psychotherapist not found."
      });
    }

    // Get the updated record
    const psychotherapist = await collection.findOne({ id });

    res.status(200).json(psychotherapist);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to update psychotherapist."
    });
  }
}


// DELETE - Delete a psychotherapist
async function deletePsychotherapist(req, res) {
  try {
    const id = Number(req.params.id);

    // Check that the ID is valid
    if (!req.params.id || Number.isNaN(id)) {
      return res.status(400).json({
        error: "A valid numeric id is required."
      });
    }

    const collection = getDatabase().collection(collectionName);

    // Delete the psychotherapist
    const result = await collection.deleteOne({ id });

    // If no record was found
    if (result.deletedCount === 0) {
      return res.status(404).json({
        error: "Psychotherapist not found."
      });
    }

    res.status(200).json({
      message: "Psychotherapist deleted successfully."
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to delete psychotherapist."
    });
  }
}


module.exports = {
  getAllPsychotherapists,
  getPsychotherapistById,
  createPsychotherapist,
  updatePsychotherapist,
  deletePsychotherapist
};