import type { Movie } from "~/@types/gen";

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

type Props = Pick<Movie, "title" | "synopsis" | "year" | "director" | "id"> & {
  genre: Pick<Movie["genre"], "name">;
};

export function MovieCard({
  title,
  synopsis,
  year,
  director,
  genre,
  id,
}: Props) {
  return (
    <Card className="w-full md:max-w-[350px] h-full flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          by {director} - {year}
        </CardDescription>
      </CardHeader>
      <CardContent className="mb-auto">
        <p>{synopsis}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Badge>{genre.name}</Badge>
        <Button asChild>
          <Link to={`/movies/${id}`}>Edit</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
