import type { V2_MetaFunction, LoaderArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { Combobox } from "~/components/combobox";
import { YearCombobox } from "~/components/years";
import { AlbumCard } from "~/components/music/AlbumCard";
import { AlbumFragment } from "~/graphql/Music/fragments.server";
import { getClient } from "~/graphql/client.server";
import { capitalize } from "~/lib/utils";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export const loader = async ({ request, context }: LoaderArgs) => {
  const url = new URL(request.url);
  const year = url.searchParams.get("year") || "1990";
  const genre = url.searchParams.get("genre")
    ? capitalize(decodeURIComponent(url.searchParams.get("genre")!))
    : "";

  const client = getClient(context);

  const {
    music: { findManyGenre, findManyAlbum: albums },
  } = await client.query({
    music: {
      findManyGenre: {
        name: true,
      },
      findManyAlbum: {
        __args: {
          orderBy: [
            {
              year: "desc",
            },
          ],
          where: {
            year: {
              equals: parseInt(year),
            },
            genre: genre
              ? {
                  name: {
                    equals: genre,
                  },
                }
              : undefined,
          },
        },
        ...AlbumFragment,
      },
    },
  });

  const genres = findManyGenre.map((genre) => genre.name);

  return { genres, genre, albums, year };
};

export default function Index() {
  const { genres, genre, albums, year } = useLoaderData<typeof loader>();

  return (
    <section className="w-full max-w-7xl ">
      <div className="mb-4 flex gap-4 px-4">
        <p className="text-2xl font-bold">Filter by genre:</p>
        <Combobox label="genre" items={genres} value={genre} />
        <p className="ml-auto text-2xl font-bold">Filter by year:</p>
        <YearCombobox value={year} />
      </div>
      <ul className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {albums.map((album) => (
          <li key={album.id}>
            <AlbumCard {...album} />
          </li>
        ))}
      </ul>
    </section>
  );
}
