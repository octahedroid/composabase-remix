import type { ActionArgs, LoaderArgs } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { Fragment } from "react";
import { Form } from "~/components/forms/form";
import { formAction } from "~/components/forms/form.action";
import { SelectInput } from "~/components/forms/select";
import { Button } from "~/components/ui/button";
import { updateAlbumMutation } from "~/graphql/Music/mutations.server";
import { updateAlbumSchema } from "~/graphql/Music/schema";
import { getClient } from "~/graphql/client.server";

export const loader = async ({ params, context }: LoaderArgs) => {
  const client = await getClient(context);

  if (!params.id) throw redirect("/music");

  const {
    music: { findManyGenre: genres, findFirstAlbum: album },
  } = await client.query({
    music: {
      findFirstAlbum: {
        __args: {
          where: {
            id: {
              equals: params.id,
            },
          },
        },
        id: true,
        artist: {
          name: true,
        },
        genre: {
          name: true,
          id: true,
        },
        members: true,
        year: true,
        label: true,
        name: true,
      },
      findManyGenre: {
        id: true,
        name: true,
      },
    },
  });

  if (!album) {
    throw redirect("/music");
  }

  return {
    genres,
    id: params.id,
    album,
  };
};

export const action = async ({ request, context }: ActionArgs) =>
  formAction({
    request,
    schema: updateAlbumSchema,
    mutation: updateAlbumMutation,
    successPath: "/music",
    environment: context,
  });

export default function AlbumUpdate() {
  const { genres, id, album } = useLoaderData<typeof loader>();

  const fetcher = useFetcher();

  return (
    <main className="flex flex-col gap-8 items-center w-full">
      <Form
        schema={updateAlbumSchema}
        className="space-y-4 w-full max-w-2xl"
        method="post"
        options={{
          genres: genres.map((artist) => ({
            name: artist.name,
            value: artist.id,
          })),
        }}
        values={{
          name: album.name,
          artist: album.artist.name,
          genres: album.genre.id,
          year: album.year,
          recordLabel: album.label,
        }}
      >
        {({ Field, Errors, Button, setValue, submit }) => {
          return (
            <Fragment>
              <Field name="name" label="Name" />
              <Field name="genres" hidden />
              <Field name="artist" />
              <Field name="genres" label="Genre">
                {({ options, label, Label, Error, value }) => (
                  <Fragment>
                    <Label />
                    <SelectInput
                      label={label}
                      options={options}
                      setValueChange={(value) =>
                        setValue("genres", value, {
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
              <Field name="recordLabel" label="Record Label" />
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
              action: "/music/delete",
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
