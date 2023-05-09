import { z } from "zod";

export const createMovieSchema = z.object({
  director: z.string().min(1).max(255),
  genre: z.string().min(1).max(255),
  synopsis: z.string().min(1),
  cast: z.string().min(1),
  year: z.number().min(1900).max(2021),
  title: z.string().min(1).max(255),
});

export const updateMovieSchema = createMovieSchema.extend({
  id: z.string(),
});

export const deleteMovieSchema = z.object({
  id: z.string(),
});
