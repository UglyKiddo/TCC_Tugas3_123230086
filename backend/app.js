const express = require("express");
const path = require("path");
const app = express();

require("./db");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname));

const noteRoutes = require("./routes/noteRoutes");
app.use("/notes", noteRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});