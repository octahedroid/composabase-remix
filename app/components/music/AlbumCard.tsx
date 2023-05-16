import type { Album } from "~/@types/gen";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "../ui/badge";
import { Link } from "@remix-run/react";

type Props = Pick<Album, "label" | "name" | "year" | "id" | "members"> & {
  genre: Pick<Album["genre"], "name">;
} & { artist: Pick<Album["artist"], "name"> };

export function AlbumCard({
  label,
  name,
  year,
  genre,
  id,
  members,
  artist,
}: Props) {
  return (
    <Card className="w-full md:max-w-[350px] h-full flex flex-col">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>
          {label} - {year}
        </CardDescription>
      </CardHeader>
      <CardContent className="mb-auto">
        <p>
          {artist.name} - {members}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Badge>{genre.name}</Badge>
        <Button asChild>
          <Link to={`/music/${id}`}>Edit</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
