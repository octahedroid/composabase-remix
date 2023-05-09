import type { V2_MetaFunction, LoaderArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { useMemo, useState } from "react";
import { GenreCombobox } from "~/components/combobox";
import { AlbumCard } from "~/components/music/AlbumCard";
import { getClient } from "~/graphql/client.server";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export const loader = async ({ context }: LoaderArgs) => {
  const client = getClient(context);

  const {
    music: { findManyGenre: genres, findManyAlbum: albums },
  } = await client.query({
    music: {
      findManyGenre: {
        id: true,
        name: true,
      },
      findManyAlbum: {
        __args: {
          orderBy: [
            {
              year: "desc",
            },
          ],
        },
        id: true,
        label: true,
        name: true,
        artist: {
          name: true,
        },
        year: true,
        genre: {
          name: true,
        },
      },
    },
  });

  return { genres, albums };
};

export default function Index() {
  const { genres, albums } = useLoaderData<typeof loader>();
  const [filter, setFilter] = useState("");

  const filteredAlbums = useMemo(() => {
    if (!filter) return albums;
    return albums.filter((album) => album.genre.name.toLowerCase() === filter);
  }, [albums, filter]);

  return (
    <main className="flex justify-center w-full py-4">
      <section className="w-full max-w-7xl">
        <div className="mb-4 flex gap-4">
          <p className="text-2xl font-bold">Filter by genre:</p>
          <GenreCombobox items={genres} value={filter} setValue={setFilter} />
        </div>
        <ul className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredAlbums.map((album) => (
            <li key={album.id}>
              <AlbumCard {...album} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
