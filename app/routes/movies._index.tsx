import type { V2_MetaFunction, LoaderArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { Combobox } from "~/components/combobox";
import { MovieCard } from "~/components/movies/MovieCard";
import { YearCombobox } from "~/components/years";
import { getClient } from "~/graphql/client.server";
import { capitalize } from "~/lib/utils";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export const loader = async ({ context, request }: LoaderArgs) => {
  const client = getClient(context);
  const url = new URL(request.url);
  const year = url.searchParams.get("year") || "1990";
  const genre = url.searchParams.get("genre")
    ? capitalize(decodeURIComponent(url.searchParams.get("genre")!))
    : "";

  const {
    movies: { findManyGenre, findManyMovie },
  } = await client.query({
    movies: {
      findManyGenre: {
        id: true,
        name: true,
      },
      findManyMovie: {
        __args: {
          where: {
            year: {
              equals: parseInt(year),
            },
            genre: genre
              ? {
                  name: {
                    contains: genre,
                  },
                }
              : undefined,
          },
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

  const genres = findManyGenre.map((genre) => genre.name);

  return { genres, genre, movies: findManyMovie, year };
};

export default function Index() {
  const { genres, genre, movies, year } = useLoaderData<typeof loader>();

  return (
    <section className="w-full max-w-7xl">
      <div className="mb-4 flex items-center gap-4">
        <p className="font-bold">Filter by genre:</p>
        <Combobox label="genre" items={genres} value={genre} />
        <p className="ml-auto text-2xl font-bold">Filter by year:</p>
        <YearCombobox value={year} />
      </div>
      <ul className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {movies.map((movie) => (
          <li key={movie.id}>
            <MovieCard {...movie} />
          </li>
        ))}
      </ul>
    </section>
  );
}
