import type { V2_MetaFunction, LoaderArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { Clapperboard } from "lucide-react";

import { GenreCombobox } from "~/components/genres";
import { MovieCard } from "~/components/movies/MovieCard";
import { Card, CardHeader } from "~/components/ui/card";
import { YearCombobox } from "~/components/years";
import { MovieFragment } from "~/graphql/Movies/fragments.server";
import { getClient } from "~/graphql/client.server";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export const loader = async ({ context, request }: LoaderArgs) => {
  const client = getClient(context);
  const url = new URL(request.url);
  const year = url.searchParams.has("year") ? parseInt(url.searchParams.get("year") as string) : undefined;
  const genre = url.searchParams.has("genre") ? url.searchParams.get("genre") : undefined;
  const {
    movies: { findManyGenre, findManyMovie },
  } = await client.query({
    movies: {
      findManyGenre: {
        __args: {
          orderBy: [
            {
              name: "asc",
            },
          ],
        },
        id: true,
        name: true,
      },
      findManyMovie: {
        __args: {
          orderBy: [
            {
              year: "asc",
            },
            {
              title: "asc",
            },
          ],
          where: {
            year: {
              equals:year,
            },
            genre: {
              id: {
                equals: genre,
              },
            },
          },
        },
        ...MovieFragment,
      },
    },
  });

  return { genres: findManyGenre, genre, movies: findManyMovie, year };
};

export default function Index() {
  const { genres, genre, movies, year } = useLoaderData<typeof loader>();

  return (
    <section className="w-full max-w-7xl">
      <div className="mb-4 flex gap-4 px-4">
        <p className="text-2xl font-bold">Filter by genre:</p>
        <GenreCombobox items={genres} value={genre} />
        <p className="ml-auto text-2xl font-bold">Filter by year:</p>
        <YearCombobox value={year} allowEmpty={true} />
      </div>
      <ul className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <li key={movie.id}>
              <MovieCard {...movie} />
            </li>
          ))
        ) : (
          <Card className="w-full col-span-full">
            <CardHeader className="flex flex-col justify-center items-center">
              <Clapperboard className="w-16 h-16" />
              <h2 className="text-2xl font-bold">No movies found</h2>
            </CardHeader>
          </Card>
        )}
      </ul>
    </section>
  );
}
