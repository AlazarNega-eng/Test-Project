import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchSongsRequest,
  createSongRequest,
  updateSongRequest,
  deleteSongRequest,
} from "./redux/songsSlice";

const styles = {
  container: {
    maxWidth: 600,
    margin: "40px auto",
    padding: 24,
    background: "#fff",
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    fontFamily: "Segoe UI, Arial, sans-serif",
  },
  heading: { marginBottom: 8 },
  subheading: { margin: "24px 0 8px 0" },
  form: { display: "flex", gap: 8, marginBottom: 16 },
  input: { flex: 1, padding: 8, borderRadius: 4, border: "1px solid #ccc" },
  button: {
    padding: "8px 16px",
    borderRadius: 4,
    border: "none",
    background: "#1976d2",
    color: "#fff",
    cursor: "pointer",
  },
  buttonDisabled: { background: "#bdbdbd", cursor: "not-allowed" },
  list: { padding: 0, listStyle: "none" },
  listItem: { marginBottom: 12, display: "flex", alignItems: "center", gap: 8 },
  error: { color: "#d32f2f", marginBottom: 12, fontWeight: 500 },
  loading: { color: "#1976d2", fontWeight: 500, marginBottom: 12 },
  pagination: { marginTop: 24, display: "flex", alignItems: "center", gap: 8 },
};

const App = () => {
  const dispatch = useDispatch();
  const { list, loading, error, page, totalPages } = useSelector(
    (state) => state.songs
  );

  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  useEffect(() => {
    dispatch(fetchSongsRequest({ page: 1 }));
  }, [dispatch]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      dispatch(fetchSongsRequest({ page: newPage }));
    }
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (newTitle.trim()) {
      dispatch(createSongRequest({ title: newTitle }));
      setNewTitle("");
    }
  };

  const handleEdit = (song) => {
    setEditingId(song.id);
    setEditingTitle(song.title);
  };

  const handleUpdate = (id) => {
    if (editingTitle.trim()) {
      dispatch(updateSongRequest({ id, title: editingTitle }));
      setEditingId(null);
      setEditingTitle("");
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteSongRequest(id));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Addis Software Test Project</h1>
      <p>Welcome! The project setup is working.</p>
      <h2 style={styles.subheading}>Songs List</h2>
      {/* Error Feedback */}
      {error && <div style={styles.error}>Error: {error}</div>}
      {/* Create Song Form */}
      <form onSubmit={handleCreate} style={styles.form}>
        <input
          type="text"
          placeholder="New song title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          style={styles.input}
        />
        <button
          type="submit"
          style={{
            ...styles.button,
            ...(loading || !newTitle.trim() ? styles.buttonDisabled : {}),
          }}
          disabled={loading || !newTitle.trim()}
        >
          Add Song
        </button>
      </form>
      {/* Loading Feedback */}
      {loading && <div style={styles.loading}>Loading...</div>}
      <ul style={styles.list}>
        {list.length === 0 && !loading ? (
          <li>No songs yet.</li>
        ) : (
          list.map((song) => (
            <li key={song.id} style={styles.listItem}>
              {editingId === song.id ? (
                <>
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    style={styles.input}
                  />
                  <button
                    onClick={() => handleUpdate(song.id)}
                    style={{
                      ...styles.button,
                      ...(loading || !editingTitle.trim()
                        ? styles.buttonDisabled
                        : {}),
                    }}
                    disabled={loading || !editingTitle.trim()}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    style={{
                      ...styles.button,
                      background: "#bdbdbd",
                      color: "#333",
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span style={{ flex: 1 }}>{song.title}</span>
                  <button
                    style={styles.button}
                    onClick={() => handleEdit(song)}
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button
                    style={{ ...styles.button, background: "#d32f2f" }}
                    onClick={() => handleDelete(song.id)}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))
        )}
      </ul>
      <div style={styles.pagination}>
        <button
          onClick={() => handlePageChange(page - 1)}
          style={{
            ...styles.button,
            ...(page <= 1 || loading ? styles.buttonDisabled : {}),
          }}
          disabled={page <= 1 || loading}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          style={{
            ...styles.button,
            ...(page >= totalPages || loading ? styles.buttonDisabled : {}),
          }}
          disabled={page >= totalPages || loading}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default App;
