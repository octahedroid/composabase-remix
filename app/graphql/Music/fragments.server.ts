import type { AlbumGenqlSelection } from "~/@types/gen";

export const AlbumFragment: AlbumGenqlSelection = {
  id: true,
  label: true,
  name: true,
  artist: {
    name: true,
  },
  members: true,
  year: true,
  genre: {
    name: true,
  },
}
