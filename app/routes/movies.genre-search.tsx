import type { LoaderArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { getClient } from "~/graphql/client.server";

export const loader = async ({ request, context }: LoaderArgs) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("genre");

  const client = getClient(context);

  const {
    movies: { findManyMovie: movies },
  } = await client.query({
    movies: {
      findManyMovie: {
        __args: {
          where: query
            ? {
                genre: {
                  name: {
                    contains: query.toLocaleUpperCase("en-US"),
                  },
                },
              }
            : null,
        },
        id: true,
        title: true,
        director: true,
        year: true,
        synopsis: true,
        genre: {
          name: true,
        },
      },
    },
  });

  return json({ movies });
};
