import { Fragment } from "react";

import type { ActionArgs, LoaderArgs } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { useFetcher, useLoaderData } from "@remix-run/react";

import { Form } from "~/components/forms/form";
import { formAction } from "~/components/forms/form.action";
import { SelectInput } from "~/components/forms/select";
import { ComboboxInput } from "~/components/forms/combobox";
import { Button } from "~/components/ui/button";
import { years } from "~/lib/utils";
import { updateAlbumMutation } from "~/graphql/Music/mutations.server";
import { updateAlbumSchema } from "~/graphql/Music/schema";
import { getClient } from "~/graphql/client.server";

export const loader = async ({ params, context }: LoaderArgs) => {
  if (!params.id) throw redirect("/music");

  const client = getClient(context);
  const {
    music: {
      findFirstAlbum: album,
      findManyGenre: genres,
      findManyArtist: artists,
    },
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
          id: true,
          name: true,
        },
        genre: {
          id: true,
          name: true,
        },
        members: true,
        year: true,
        label: true,
        name: true,
      },
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
      findManyArtist: {
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
    },
  });

  if (!album) {
    throw redirect("/music");
  }

  return {
    genres,
    artists,
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
  const { genres, artists, id, album } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  return (
    <div className="flex flex-col gap-8 items-center w-full">
      <Form
        schema={updateAlbumSchema}
        className="space-y-4 w-full max-w-2xl"
        method="post"
        options={{
          artist: artists.map((artist) => ({
            name: artist.name,
            value: artist.id,
          })),
          genre: genres.map((genre) => ({
            name: genre.name,
            value: genre.id,
          })),
          years: years.map((year) => ({
            name: year,
            value: year,
          })),
        }}
        values={{
          id,
          name: album.name,
          artist: album.artist.id,
          genre: album.genre.id,
          year: album.year,
          recordLabel: album.label,
        }}
      >
        {({ Field, Errors, Button, setValue, submit }) => {
          return (
            <Fragment>
              <Field name="id" hidden />
              <Field name="name" label="Name" />
              <Field name="genre" hidden />
              <Field name="artist" hidden />
              <Field name="year" hidden />
              <Field name="artist" label="Artist">
                {({ options, Label, Error }) => (
                  <Fragment>
                    <Label />
                    <ComboboxInput
                      label="Artist"
                      value={album.artist.id}
                      options={options}
                      setValueChange={(value) =>
                        setValue("artist", value, {
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
              <Field name="genre" label="Genre">
                {({ options, Label, Error }) => (
                  <Fragment>
                    <Label />
                    <SelectInput
                      label={`Genre`}
                      value={album.genre.id}
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
              <Field name="years" label="Release Year">
                {({ options, Label, Error }) => (
                  <Fragment>
                    <Label />
                    <SelectInput
                      label={`Year`}
                      value={String(album.year)}
                      options={options}
                      setValueChange={(value) =>
                        setValue("year", Number(value), {
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
    </div>
  );
}
