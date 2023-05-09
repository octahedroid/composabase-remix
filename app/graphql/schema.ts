import { z } from "zod";

export const environmentSchema = z.object({
  GRAPHQL_ENDPOINT: z.string().url(),
  GRAPHQL_AUTH: z.string(),
});
