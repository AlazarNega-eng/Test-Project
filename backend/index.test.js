global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;
const request = require("supertest");
const express = require("express");
const cors = require("cors");

let app;
let songs;
let nextId;

beforeEach(() => {
  app = express();
  app.use(cors());
  app.use(express.json());
  songs = [];
  nextId = 1;

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

  app.post("/songs", (req, res) => {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });
    const song = { id: nextId++, title };
    songs.unshift(song);
    res.status(201).json(song);
  });

  app.put("/songs/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { title } = req.body;
    const idx = songs.findIndex((s) => s.id === id);
    if (idx === -1) return res.status(404).json({ error: "Song not found" });
    songs[idx].title = title;
    res.json(songs[idx]);
  });

  app.delete("/songs/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const idx = songs.findIndex((s) => s.id === id);
    if (idx === -1) return res.status(404).json({ error: "Song not found" });
    songs.splice(idx, 1);
    res.status(204).end();
  });
});

test("GET /songs returns empty list initially", async () => {
  const res = await request(app).get("/songs");
  expect(res.statusCode).toBe(200);
  expect(res.body.list).toEqual([]);
  expect(res.body.page).toBe(1);
  expect(res.body.totalPages).toBe(1);
});

test("POST /songs creates a new song", async () => {
  const res = await request(app).post("/songs").send({ title: "Test Song" });
  expect(res.statusCode).toBe(201);
  expect(res.body.title).toBe("Test Song");
  expect(res.body.id).toBeDefined();
});
