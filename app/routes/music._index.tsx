import type { V2_MetaFunction, LoaderArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

import { GenreCombobox } from "~/components/genres";
import { YearCombobox } from "~/components/years";
import { AlbumCard } from "~/components/music/AlbumCard";
import { AlbumFragment } from "~/graphql/Music/fragments.server";
import { getClient } from "~/graphql/client.server";
import { Card, CardHeader } from "~/components/ui/card";
import { Disc } from "lucide-react";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export const loader = async ({ request, context }: LoaderArgs) => {
  const client = getClient(context);
  const url = new URL(request.url);
  const year = url.searchParams.has("year") ? parseInt(url.searchParams.get("year") as string) : undefined;
  const genre = url.searchParams.has("genre") ? url.searchParams.get("genre") : undefined;
  const {
    music: { findManyGenre, findManyAlbum: albums },
  } = await client.query({
    music: {
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
      findManyAlbum: {
        __args: {
          orderBy: [
            {
              year: "asc",
            },
            {
              name: "asc",
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
        ...AlbumFragment,
      },
    },
  });

  return { genres: findManyGenre, genre, albums, year };
};

export default function Index() {
  const { genres, genre, albums, year } = useLoaderData<typeof loader>();

  return (
    <section className="w-full max-w-7xl">
      <div className="mb-4 flex gap-4 px-4">
        <p className="text-2xl font-bold">Filter by genre:</p>
        <GenreCombobox items={genres} value={genre} />
        <p className="ml-auto text-2xl font-bold">Filter by year:</p>
        <YearCombobox value={year} allowEmpty={true} />
      </div>
      <ul className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {albums.length > 0 ? (
          albums.map((album) => (
            <li key={album.id}>
              <AlbumCard {...album} />
            </li>
          ))
        ) : (
          <Card className="w-full col-span-full">
            <CardHeader className="flex flex-col justify-center items-center">
              <Disc className="w-16 h-16" />
              <h2 className="text-2xl font-bold">No albums found</h2>
            </CardHeader>
          </Card>
        )}
      </ul>
    </section>
  );
}
