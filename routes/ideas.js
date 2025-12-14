const express = require("express");
const router = express.Router();

const {
  createIdea,
  getIdeas,
  getIdeaById,
  deleteIdea
} = require("../controllers/ideaController");

// POST → create idea + AI analysis
router.post("/", createIdea);

// GET → all ideas
router.get("/", getIdeas);

// GET → single idea
router.get("/:id", getIdeaById);

// DELETE → optional
router.delete("/:id", deleteIdea);

module.exports = router;
