import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchSongsRequest,
  createSongRequest,
  updateSongRequest,
  deleteSongRequest,
} from "./redux/songsSlice";
import styled from "@emotion/styled";
import { css, useTheme } from "@emotion/react";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[5]}px;
  background: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 2.7rem;
  margin-bottom: 8px;
  background: ${({ theme }) => theme.colors.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  font-weight: 800;
  letter-spacing: 1px;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: 20px;
`;

const AddSongSection = styled.div`
  background: ${({ theme }) => theme.colors.card};
  padding: 24px;
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: 32px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  align-items: end;
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  padding: 10px;
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 15px;
  background: #f9fafb;
  transition: border 0.2s;
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: ${({ theme }) => theme.radii.sm};
  border: none;
  background: ${({ theme, variant }) =>
    variant === "secondary"
      ? theme.colors.secondary
      : variant === "danger"
      ? theme.colors.error
      : theme.colors.primary};
  color: #fff;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(79, 140, 255, 0.08);
  transition: ${({ theme }) => theme.transitions.base};
  &:hover {
    background: ${({ theme, variant }) =>
      variant === "secondary"
        ? "#e48b13"
        : variant === "danger"
        ? "#b91c1c"
        : theme.colors.primaryDark};
    transform: translateY(-2px) scale(1.03);
    box-shadow: ${({ theme }) => theme.shadows.hover};
  }
  &:disabled {
    background: ${({ theme }) => theme.colors.muted};
    cursor: not-allowed;
    opacity: 0.7;
    transform: none;
  }
`;

const SongsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const SongCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 24px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: ${({ theme }) => theme.transitions.base};
  position: relative;
  overflow: hidden;
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.hover};
    transform: translateY(-4px) scale(1.02);
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SongTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 6px;
  color: ${({ theme }) => theme.colors.primaryDark};
`;

const SongArtist = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 6px;
  font-weight: 500;
`;

const SongDetails = styled.div`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: 10px;
`;

const SongGenre = styled.div`
  display: inline-block;
  background: ${({ theme }) => theme.colors.gradient};
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  color: #fff;
  margin-bottom: 10px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(79, 140, 255, 0.08);
`;

const CardActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const EditForm = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 15px;
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const EditFormFull = styled.div`
  grid-column: 1 / -1;
`;

const ErrorMsg = styled.div`
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: 15px;
  padding: 10px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-weight: 500;
`;

const LoadingMsg = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  padding: 20px;
  font-size: 1.1rem;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 18px;
  margin-top: 30px;
`;

const PaginationInfo = styled.span`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.98rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 1.1rem;
`;

const App = () => {
  const dispatch = useDispatch();
  const { list, loading, error, page, totalPages } = useSelector(
    (state) => state.songs
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSong, setNewSong] = useState({
    title: "",
    artist: "",
    album: "",
    year: "",
    genre: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editingSong, setEditingSong] = useState({});

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
    if (newSong.title.trim() && newSong.artist.trim()) {
      const songData = {
        ...newSong,
        year: newSong.year ? parseInt(newSong.year) : null,
      };
      dispatch(createSongRequest(songData));
      setNewSong({ title: "", artist: "", album: "", year: "", genre: "" });
      setShowAddForm(false);
    }
  };

  const handleEdit = (song) => {
    setEditingId(song.id);
    setEditingSong({
      title: song.title,
      artist: song.artist,
      album: song.album || "",
      year: song.year || "",
      genre: song.genre || "",
    });
  };

  const handleUpdate = (id) => {
    if (editingSong.title.trim() && editingSong.artist.trim()) {
      const songData = {
        id,
        ...editingSong,
        year: editingSong.year ? parseInt(editingSong.year) : null,
      };
      dispatch(updateSongRequest(songData));
      setEditingId(null);
      setEditingSong({});
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this song?")) {
      dispatch(deleteSongRequest(id));
    }
  };

  const handleInputChange = (setter, field, value) => {
    setter((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Container>
      <Header>
        <Title>🎵 Music Library</Title>
        <Subtitle>Manage your favorite songs</Subtitle>
      </Header>
      <AddSongSection>
        {!showAddForm ? (
          <Button onClick={() => setShowAddForm(true)}>➕ Add New Song</Button>
        ) : (
          <Form onSubmit={handleCreate}>
            <FormGroup>
              <Label>Title *</Label>
              <Input
                type="text"
                value={newSong.title}
                onChange={(e) =>
                  handleInputChange(setNewSong, "title", e.target.value)
                }
                placeholder="Song title"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Artist *</Label>
              <Input
                type="text"
                value={newSong.artist}
                onChange={(e) =>
                  handleInputChange(setNewSong, "artist", e.target.value)
                }
                placeholder="Artist name"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Album</Label>
              <Input
                type="text"
                value={newSong.album}
                onChange={(e) =>
                  handleInputChange(setNewSong, "album", e.target.value)
                }
                placeholder="Album name"
              />
            </FormGroup>
            <FormGroup>
              <Label>Year</Label>
              <Input
                type="number"
                value={newSong.year}
                onChange={(e) =>
                  handleInputChange(setNewSong, "year", e.target.value)
                }
                placeholder="Release year"
                min="1900"
                max="2024"
              />
            </FormGroup>
            <FormGroup>
              <Label>Genre</Label>
              <Input
                type="text"
                value={newSong.genre}
                onChange={(e) =>
                  handleInputChange(setNewSong, "genre", e.target.value)
                }
                placeholder="Genre"
              />
            </FormGroup>
            <FormGroup>
              <Button
                type="submit"
                disabled={
                  loading || !newSong.title.trim() || !newSong.artist.trim()
                }
              >
                {loading ? "Adding..." : "Add Song"}
              </Button>
            </FormGroup>
            <FormGroup>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
            </FormGroup>
          </Form>
        )}
      </AddSongSection>
      {error && <ErrorMsg>Error: {error}</ErrorMsg>}
      {loading && <LoadingMsg>Loading songs...</LoadingMsg>}
      {!loading && list.length === 0 ? (
        <EmptyState>No songs found. Add your first song above!</EmptyState>
      ) : (
        <SongsGrid>
          {list.map((song) => (
            <SongCard key={song.id}>
              {editingId === song.id ? (
                <div>
                  <EditForm>
                    <FormGroup>
                      <Label>Title *</Label>
                      <Input
                        type="text"
                        value={editingSong.title}
                        onChange={(e) =>
                          handleInputChange(
                            setEditingSong,
                            "title",
                            e.target.value
                          )
                        }
                        required
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Artist *</Label>
                      <Input
                        type="text"
                        value={editingSong.artist}
                        onChange={(e) =>
                          handleInputChange(
                            setEditingSong,
                            "artist",
                            e.target.value
                          )
                        }
                        required
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Album</Label>
                      <Input
                        type="text"
                        value={editingSong.album}
                        onChange={(e) =>
                          handleInputChange(
                            setEditingSong,
                            "album",
                            e.target.value
                          )
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Year</Label>
                      <Input
                        type="number"
                        value={editingSong.year}
                        onChange={(e) =>
                          handleInputChange(
                            setEditingSong,
                            "year",
                            e.target.value
                          )
                        }
                        min="1900"
                        max="2024"
                      />
                    </FormGroup>
                    <EditFormFull>
                      <Label>Genre</Label>
                      <Input
                        type="text"
                        value={editingSong.genre}
                        onChange={(e) =>
                          handleInputChange(
                            setEditingSong,
                            "genre",
                            e.target.value
                          )
                        }
                      />
                    </EditFormFull>
                  </EditForm>
                  <CardActions>
                    <Button
                      onClick={() => handleUpdate(song.id)}
                      disabled={
                        loading ||
                        !editingSong.title.trim() ||
                        !editingSong.artist.trim()
                      }
                    >
                      {loading ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      onClick={() => setEditingId(null)}
                      variant="secondary"
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </CardActions>
                </div>
              ) : (
                <div>
                  <SongTitle>{song.title}</SongTitle>
                  <SongArtist>by {song.artist}</SongArtist>
                  {song.album && <SongDetails>Album: {song.album}</SongDetails>}
                  {song.year && <SongDetails>Year: {song.year}</SongDetails>}
                  {song.genre && <SongGenre>{song.genre}</SongGenre>}
                  <CardActions>
                    <Button onClick={() => handleEdit(song)}>✏️ Edit</Button>
                    <Button
                      onClick={() => handleDelete(song.id)}
                      variant="danger"
                    >
                      🗑️ Delete
                    </Button>
                  </CardActions>
                </div>
              )}
            </SongCard>
          ))}
        </SongsGrid>
      )}
      {totalPages > 1 && (
        <Pagination>
          <Button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1 || loading}
          >
            ← Previous
          </Button>
          <PaginationInfo>
            Page {page} of {totalPages}
          </PaginationInfo>
          <Button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages || loading}
          >
            Next →
          </Button>
        </Pagination>
      )}
    </Container>
  );
};

export default App;
