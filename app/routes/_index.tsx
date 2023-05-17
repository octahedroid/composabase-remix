import type { LoaderArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

import { YearCombobox } from "~/components/years";
import { RecordsCombobox } from "~/components/records";
import { Separator } from "~/components/ui/separator"
import { MovieCard } from "~/components/movies/MovieCard";
import { AlbumCard } from "~/components/music/AlbumCard";

import { getClient } from "~/graphql/client.server";
import { AlbumFragment } from "~/graphql/Music/fragments.server";
import { MovieFragment } from "~/graphql/Movies/fragments.server";

export const loader = async ({ request, context }: LoaderArgs) => {
  const url = new URL(request.url);
  const records = url.searchParams.get("records") || undefined;
  const year = url.searchParams.get("year") || undefined;
  const client = getClient(context);
  const {
    music: { findManyAlbum },
    movies: { findManyMovie },
  } = await client.query({
    music: {
      findManyAlbum: {
        __args: {
          take: records ? parseInt(records) : undefined,
          where: {
            year: year
              ? {
                  equals: parseInt(year),
                }
              : undefined,
          },
          orderBy: [
            {
              year: "asc",
            },
            {
              name: "asc",
            }
          ],
        },
        ...AlbumFragment,
      },
    },
    movies: {
      findManyMovie: {
        __args: {
          take: records ? parseInt(records) : undefined,
          where: {
            year: year
              ? {
                  equals: parseInt(year),
                }
              : undefined,
          },
          orderBy: [
            {
              year: "asc",
            },
            {
              title: "asc",
            }
          ],
        },
        ...MovieFragment,
      },
    },
  });

  return { records, year, movies: findManyMovie, albums: findManyAlbum };
};

export default function Index() {
  const { records, year, movies, albums } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col justify-center w-full py-4">
      <h1 className="text-2xl">All</h1>
      <section className="w-full max-w-7xl">
        <div className="mb-4 flex gap-4 px-4">
        <p className="text-2xl font-bold">Take:</p>
          <RecordsCombobox value={records} allowEmpty />
          <p className="ml-auto text-2xl font-bold">Filter by year:</p>
          <YearCombobox value={year} allowEmpty />
        </div>
        <p className="ml-auto text-2xl font-bold">{`Music: ${albums.length} of ${records?records:albums.length}`}</p>
        <ul className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {albums && albums.length > 0 ? (
            albums.map((album) => (
              <li key={album.id}>
                <AlbumCard {...album} />
              </li>
            ))
          ) : (
            <p className="text-2xl font-bold">No albums found</p>
          )}
        </ul>
        <Separator className="my-4" />
        <p className="ml-auto text-2xl font-bold">{`Movies: ${movies.length} of ${records?records:movies.length}`}</p>
        <ul className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {movies && movies.length > 0 ? (
            movies.map((movie) => (
              <li key={movie.id}>
                <MovieCard {...movie} />
              </li>
            ))
          ) : (
            <p className="text-2xl font-bold">No movies found</p>
          )}
        </ul>
      </section>
    </div>
  );
}
