const express = require("express");
const router = express.Router();
const notesController = require("../controllers/notesController");

router.get("/notes", notesController.getNotes);
router.post("/notes", notesController.addNote);
router.put("/notes/:id", notesController.editNote);
router.delete("/notes/:id", notesController.removeNote);

module.exports = router;