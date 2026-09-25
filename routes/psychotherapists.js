const express = require("express");

const router = express.Router();

const { isLoggedIn } = require("../middleware/auth");

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

// POST - Create a new psychotherapist (requires GitHub login)
// Example: POST /psychotherapists
router.post("/", isLoggedIn, createPsychotherapist);

// PUT - Update a psychotherapist (requires GitHub login)
// Example: PUT /psychotherapists/1884858585858
router.put("/:id", isLoggedIn, updatePsychotherapist);

// DELETE - Delete a psychotherapist (requires GitHub login)
// Example: DELETE /psychotherapists/1884858585858
router.delete("/:id", isLoggedIn, deletePsychotherapist);

module.exports = router;
