const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// In-memory songs storage with sample data
let songs = [
  {
    id: 1,
    title: "Bohemian Rhapsody",
    artist: "Queen",
    album: "A Night at the Opera",
    year: 1975,
    genre: "Rock",
  },
  {
    id: 2,
    title: "Hotel California",
    artist: "Eagles",
    album: "Hotel California",
    year: 1976,
    genre: "Rock",
  },
  {
    id: 3,
    title: "Imagine",
    artist: "John Lennon",
    album: "Imagine",
    year: 1971,
    genre: "Pop",
  },
  {
    id: 4,
    title: "Stairway to Heaven",
    artist: "Led Zeppelin",
    album: "Led Zeppelin IV",
    year: 1971,
    genre: "Rock",
  },
  {
    id: 5,
    title: "Like a Rolling Stone",
    artist: "Bob Dylan",
    album: "Highway 61 Revisited",
    year: 1965,
    genre: "Folk Rock",
  },
];
let nextId = 6;

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
  const { title, artist, album, year, genre } = req.body;
  if (!title || !artist) {
    return res.status(400).json({ error: "Title and artist are required" });
  }

  const song = {
    id: nextId++,
    title,
    artist,
    album: album || "",
    year: year || null,
    genre: genre || "",
  };
  songs.unshift(song);
  res.status(201).json(song);
});

// PUT /songs/:id
app.put("/songs/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { title, artist, album, year, genre } = req.body;
  const idx = songs.findIndex((s) => s.id === id);
  if (idx === -1) return res.status(404).json({ error: "Song not found" });

  songs[idx] = {
    ...songs[idx],
    title: title || songs[idx].title,
    artist: artist || songs[idx].artist,
    album: album !== undefined ? album : songs[idx].album,
    year: year !== undefined ? year : songs[idx].year,
    genre: genre !== undefined ? genre : songs[idx].genre,
  };
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
