const express = require("express");

const router = express.Router();

const {
  getAllPsychotherapists,
  getPsychotherapistById,
  createPsychotherapist
} = require("../controllers/psychotherapists");

// GET all psychotherapists
router.get("/", getAllPsychotherapists);

// GET one psychotherapist by ID
router.get("/by-id", getPsychotherapistById);

// POST - Create a new psychotherapist
router.post("/", createPsychotherapist);

module.exports = router;