const express = require("express");

const router = express.Router();

const {
  getAllPsychotherapists,
  getPsychotherapistById,
  createPsychotherapist,
  updatePsychotherapist,
  deletePsychotherapist
} = require("../controllers/psychotherapists");

// GET all psychotherapists
// Example: GET /psychotherapists
router.get("/", getAllPsychotherapists);

// GET one psychotherapist by ID
// Example: GET /psychotherapists/by-id?id=1884858585858
router.get("/by-id", getPsychotherapistById);

// POST - Create a new psychotherapist
// Example: POST /psychotherapists
router.post("/", createPsychotherapist);

// PUT - Update a psychotherapist
// Example: PUT /psychotherapists/1884858585858
router.put("/:id", updatePsychotherapist);

// DELETE - Delete a psychotherapist
// Example: DELETE /psychotherapists/1884858585858
router.delete("/:id", deletePsychotherapist);

module.exports = router;