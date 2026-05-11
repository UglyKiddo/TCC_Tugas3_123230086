const db = require("../db");

const getAllNotes = (callback) => {
  db.query("SELECT * FROM notes", callback);
};

const createNote = (judul, isi, callback) => {
  db.query(
    "INSERT INTO notes (judul, isi) VALUES (?, ?)",
    [judul, isi],
    callback
  );
};

const updateNote = (id, judul, isi, callback) => {
  db.query(
    "UPDATE notes SET judul=?, isi=? WHERE id=?",
    [judul, isi, id],
    callback
  );
};

const deleteNote = (id, callback) => {
  db.query("DELETE FROM notes WHERE id=?", [id], callback);
};

module.exports = {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
};