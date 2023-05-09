import { z } from "zod";

export const createAlbumSchema = z.object({
  name: z.string().min(1).max(255),
  artist: z.string().min(1).max(255),
  genres: z.string().min(1).max(255),
  year: z.number().min(1900).max(2021),
  recordLabel: z.string().min(1).max(255),
});

export const updateAlbumSchema = createAlbumSchema.extend({
  id: z.string(),
});

export const deleteAlbumSchema = z.object({
  id: z.string(),
});
