# Addis Software Test Project

This is a full-stack application where the frontend (React + Redux Toolkit + Redux-Saga) interacts with a custom Node/Express REST API to manage a list of songs.

## Features
- Paginated list of songs
- Create, Read, Update, Delete (CRUD) operations
- Manual Webpack configuration (no CRA)
- State management with Redux Toolkit and Redux-Saga
- Simple Node/Express backend (in-memory storage)

---

## Setup Instructions

### 1. Backend
```bash
cd backend
npm install
node index.js
```
The backend will run at [http://localhost:4000](http://localhost:4000)

### 2. Frontend
```bash
npm install
npx webpack serve --port 3001
```
The frontend will run at [http://localhost:3001](http://localhost:3001)

---

## Backend API Documentation

### Base URL
```
http://localhost:4000
```

### Endpoints

#### `GET /songs`
- Query params: `page` (default: 1), `limit` (default: 10)
- Response:
  ```json
  {
    "list": [ { "id": 1, "title": "..." }, ... ],
    "page": 1,
    "totalPages": 1
  }
  ```

#### `POST /songs`
- Body: `{ "title": "Song Title" }`
- Response: Created song object

#### `PUT /songs/:id`
- Body: `{ "title": "New Title" }`
- Response: Updated song object

#### `DELETE /songs/:id`
- Response: 204 No Content

---

## Notes
- All data is stored in-memory (restarts will reset the song list).
- CORS is enabled for local frontend-backend communication.
- For more details, see code comments and source files.
