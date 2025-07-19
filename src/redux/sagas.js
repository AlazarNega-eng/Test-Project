import { all, call, put, takeLatest } from "redux-saga/effects";
import {
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
} from "./songsSlice";

const API_URL =
  process.env.API_BASE_URL || "https://jsonplaceholder.typicode.com/posts";

function* fetchSongsSaga(action) {
  try {
    const page = action.payload?.page || 1;
    const limit = 10;
    const response = yield call(fetch, `${API_URL}`);
    const data = yield response.json();
    const total = data.length;
    const totalPages = Math.ceil(total / limit);
    const paginated = data.slice((page - 1) * limit, page * limit);
    yield put(fetchSongsSuccess({ list: paginated, page, totalPages }));
  } catch (error) {
    yield put(fetchSongsFailure(error.message || "Failed to fetch songs"));
  }
}

function* createSongSaga(action) {
  try {
    const response = yield call(fetch, API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(action.payload),
    });
    const data = yield response.json();
    yield put(createSongSuccess(data));
  } catch (error) {
    yield put(createSongFailure(error.message || "Failed to create song"));
  }
}

function* updateSongSaga(action) {
  try {
    const { id, ...rest } = action.payload;
    const response = yield call(fetch, `${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rest),
    });
    const data = yield response.json();
    yield put(updateSongSuccess(data));
  } catch (error) {
    yield put(updateSongFailure(error.message || "Failed to update song"));
  }
}

function* deleteSongSaga(action) {
  try {
    const id = action.payload;
    yield call(fetch, `${API_URL}/${id}`, { method: "DELETE" });
    yield put(deleteSongSuccess(id));
  } catch (error) {
    yield put(deleteSongFailure(error.message || "Failed to delete song"));
  }
}

function* songsSaga() {
  yield takeLatest(fetchSongsRequest.type, fetchSongsSaga);
  yield takeLatest(createSongRequest.type, createSongSaga);
  yield takeLatest(updateSongRequest.type, updateSongSaga);
  yield takeLatest(deleteSongRequest.type, deleteSongSaga);
}

export default function* rootSaga() {
  yield all([songsSaga()]);
}
