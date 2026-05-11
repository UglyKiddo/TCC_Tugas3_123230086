const Notes = require("../models/notesModel");

const getNotes = (req, res) => {
  Notes.getAllNotes((err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

const addNote = (req, res) => {
  const { judul, isi } = req.body;

  Notes.createNote(judul, isi, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
};

const editNote = (req, res) => {
  const { id } = req.params;
  const { judul, isi } = req.body;

  Notes.updateNote(id, judul, isi, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
};

const removeNote = (req, res) => {
  const { id } = req.params;

  Notes.deleteNote(id, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
};

module.exports = {
  getNotes,
  addNote,
  editNote,
  removeNote,
};