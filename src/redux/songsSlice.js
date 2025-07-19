import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,
};

const songsSlice = createSlice({
  name: "songs",
  initialState,
  reducers: {
    setSongs(state, action) {
      state.list = action.payload.list;
      state.page = action.payload.page;
      state.totalPages = action.payload.totalPages;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    fetchSongsRequest(state, action) {
      state.loading = true;
      state.error = null;
    },
    fetchSongsSuccess(state, action) {
      state.list = action.payload.list;
      state.page = action.payload.page;
      state.totalPages = action.payload.totalPages;
      state.loading = false;
    },
    fetchSongsFailure(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    // Create
    createSongRequest(state, action) {
      state.loading = true;
      state.error = null;
    },
    createSongSuccess(state, action) {
      state.list.unshift(action.payload);
      state.loading = false;
    },
    createSongFailure(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    // Update
    updateSongRequest(state, action) {
      state.loading = true;
      state.error = null;
    },
    updateSongSuccess(state, action) {
      const idx = state.list.findIndex((song) => song.id === action.payload.id);
      if (idx !== -1) state.list[idx] = action.payload;
      state.loading = false;
    },
    updateSongFailure(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    // Delete
    deleteSongRequest(state, action) {
      state.loading = true;
      state.error = null;
    },
    deleteSongSuccess(state, action) {
      state.list = state.list.filter((song) => song.id !== action.payload);
      state.loading = false;
    },
    deleteSongFailure(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setSongs,
  setLoading,
  setError,
  fetchSongsRequest,
  fetchSongsSuccess,
  fetchSongsFailure,
  createSongRequest,
  createSongSuccess,
  createSongFailure,
  updateSongRequest,
  updateSongSuccess,
  updateSongFailure,
  deleteSongRequest,
  deleteSongSuccess,
  deleteSongFailure,
} = songsSlice.actions;
export default songsSlice.reducer;
