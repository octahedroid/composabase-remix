import type { V2_MetaFunction, LoaderArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { useMemo, useState } from "react";
import { Combobox } from "~/components/combobox";
import { AlbumCard } from "~/components/music/AlbumCard";
import { AlbumFragment } from "~/graphql/Music/fragments.server";
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
        ...AlbumFragment,
      },
    },
  });

  const years = albums.reduce((acc, album) => {
    if (acc.some((year) => year.id === String(album.year))) return acc;
    const yearOption = { id: String(album.year), name: String(album.year) };
    return [...acc, yearOption];
  }, [] as { id: string; name: string }[]);

  return { genres, albums, years };
};

export default function Index() {
  const { genres, albums, years } = useLoaderData<typeof loader>();
  const [filterByGenre, setFilterByGenre] = useState("");
  const [filterByYear, setFilterByYear] = useState("");

  const filteredAlbums = useMemo(() => {
    return albums.filter((album) => {
      const isGenreMatch =
        !filterByGenre || album.genre.name.toLowerCase() === filterByGenre;
      const isYearMatch = !filterByYear || album.year === Number(filterByYear);
      return isGenreMatch && isYearMatch;
    });
  }, [albums, filterByGenre, filterByYear]);

  return (
    // <main className="flex justify-center w-full py-4">
      <section className="w-full max-w-7xl ">
        <div className="mb-4 flex gap-4 px-4">
          <p className="text-2xl font-bold">Filter by genre:</p>
          <Combobox
            label="genre"
            items={genres}
            value={filterByGenre}
            setValue={setFilterByGenre}
          />
          <p className="ml-auto text-2xl font-bold">Filter by year:</p>
          <Combobox
            label="year"
            items={years}
            value={filterByYear}
            setValue={setFilterByYear}
          />
        </div>
        <ul className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredAlbums.map((album) => (
            <li key={album.id}>
              <AlbumCard {...album} />
            </li>
          ))}
        </ul>
      </section>
    // </main>
  );
}
