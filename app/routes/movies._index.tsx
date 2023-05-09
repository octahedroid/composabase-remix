import type { V2_MetaFunction, LoaderArgs } from "@remix-run/cloudflare";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import type { Movie } from "~/@types/gen";
import { GenreCombobox } from "~/components/combobox";
import { MovieCard } from "~/components/movies/MovieCard";
import { getClient } from "~/graphql/client.server";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export const loader = async ({ context }: LoaderArgs) => {
  const client = getClient(context);

  const {
    movies: { findManyGenre: genres },
  } = await client.query({
    movies: {
      findManyGenre: {
        id: true,
        name: true,
      },
    },
  });

  return { genres };
};

export default function Index() {
  const { genres } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<{ movies: Movie[] }>();
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (fetcher.state === "idle") {
      fetcher.load(`/movies/genre-search?${filter ? `genre=${filter}` : ""}`);
    }
  }, [filter]);

  return (
    <section className="w-full max-w-7xl">
      <div className="mb-4 flex items-center gap-4">
        <p className="font-bold">Filter by genre:</p>
        <GenreCombobox items={genres} value={filter} setValue={setFilter} />
      </div>
      <ul className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {fetcher.data &&
          fetcher.data.movies.map((movie) => (
            <li key={movie.id}>
              <MovieCard {...movie} />
            </li>
          ))}
      </ul>
    </section>
  );
}
