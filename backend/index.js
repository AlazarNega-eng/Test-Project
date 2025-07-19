const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// In-memory songs storage
let songs = [];
let nextId = 1;

// GET /songs (with pagination)
app.get("/songs", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = songs.slice(start, end);
  res.json({
    list: paginated,
    page,
    totalPages: Math.ceil(songs.length / limit) || 1,
  });
});

// POST /songs
app.post("/songs", (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });
  const song = { id: nextId++, title };
  songs.unshift(song);
  res.status(201).json(song);
});

// PUT /songs/:id
app.put("/songs/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { title } = req.body;
  const idx = songs.findIndex((s) => s.id === id);
  if (idx === -1) return res.status(404).json({ error: "Song not found" });
  songs[idx].title = title;
  res.json(songs[idx]);
});

// DELETE /songs/:id
app.delete("/songs/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const idx = songs.findIndex((s) => s.id === id);
  if (idx === -1) return res.status(404).json({ error: "Song not found" });
  songs.splice(idx, 1);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
