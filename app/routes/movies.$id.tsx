import type { ActionArgs, LoaderArgs } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { Fragment } from "react";
import { Form } from "~/components/forms/form";
import { formAction } from "~/components/forms/form.action";
import { SelectInput } from "~/components/forms/select";
import { Button } from "~/components/ui/button";
import { updateMovieMutation } from "~/graphql/Movies/mutations.server";
import { updateMovieSchema } from "~/graphql/Movies/schema";
import { getClient } from "~/graphql/client.server";

export const loader = async ({ params, context }: LoaderArgs) => {
  const client = await getClient(context);

  if (!params.id) throw redirect("/movies");

  const {
    movies: { findManyGenre: genres, findFirstMovie: movie },
  } = await client.query({
    movies: {
      findFirstMovie: {
        __args: {
          where: {
            id: {
              equals: params.id,
            },
          },
        },
        id: true,
        title: true,
        director: true,
        year: true,
        synopsis: true,
        cast: true,
        genre: {
          id: true,
        },
      },
      findManyGenre: {
        id: true,
        name: true,
      },
    },
  });

  if (!movie) {
    throw redirect("/movies");
  }

  return {
    genres,
    id: params.id,
    movie,
  };
};

export const action = async ({ request, context }: ActionArgs) =>
  formAction({
    request,
    schema: updateMovieSchema,
    mutation: updateMovieMutation,
    successPath: "/movies",
    environment: context,
  });

export default function MovieUpdate() {
  const { genres, id, movie } = useLoaderData<typeof loader>();

  const fetcher = useFetcher();

  return (
    <main className="flex flex-col gap-8 items-center w-full">
      <Form
        schema={updateMovieSchema}
        className="space-y-4 w-full max-w-2xl"
        method="post"
        options={{
          genre: genres.map((genre) => ({
            name: genre.name,
            value: genre.id,
          })),
        }}
        multiline={["synopsis"]}
        values={{
          id,
          title: movie.title,
          director: movie.director,
          year: movie.year,
          synopsis: movie.synopsis,
          cast: movie.cast,
          genre: movie.genre.id,
        }}
      >
        {({ Field, Errors, Button, setValue, submit }) => {
          return (
            <Fragment>
              <Field name="id" hidden />
              <Field name="title" label="Title" />
              <Field name="genre" hidden />
              <Field name="director" />
              <Field name="genre" label="Genre">
                {({ options, label, Label, Error, value }) => (
                  <Fragment>
                    <Label />
                    <SelectInput
                      label={label}
                      options={options}
                      setValueChange={(value) =>
                        setValue("genre", value, {
                          shouldValidate: false,
                          shouldDirty: false,
                          shouldTouch: false,
                        })
                      }
                    />
                    <Error />
                  </Fragment>
                )}
              </Field>
              <Field name="year" label="Release Year" />
              <Field name="synopsis" label="Synopsis" />
              <Field name="cast" label="Cast" />
              <Errors />
              <Button
                onClick={() => {
                  submit();
                }}
                className="w-full"
              >
                Save
              </Button>
            </Fragment>
          );
        }}
      </Form>
      <Button
        onClick={() => {
          fetcher.submit(
            {
              id,
            },
            {
              action: "/movies/delete",
              method: "post",
            }
          );
        }}
        variant="destructive"
        className="w-full max-w-2xl"
      >
        Delete
      </Button>
    </main>
  );
}
