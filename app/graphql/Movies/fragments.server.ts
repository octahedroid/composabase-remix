import type { MovieGenqlSelection } from "~/@types/gen";

export const MovieFragment: MovieGenqlSelection = {
  id: true,
  title: true,
  director: true,
  year: true,
  synopsis: true,
  genre: {
    name: true,
  },
}
