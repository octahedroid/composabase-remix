import type { ActionArgs, LoaderArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { Fragment } from "react";
import { ComboboxInput } from "~/components/forms/combobox";
import { Form } from "~/components/forms/form";
import { formAction } from "~/components/forms/form.action";
import { SelectInput } from "~/components/forms/select";
import { createAlbumMutation } from "~/graphql/Music/mutations.server";
import { createAlbumSchema } from "~/graphql/Music/schema";
import { getClient } from "~/graphql/client.server";
import { years } from "~/lib/utils";

export const loader = async ({ request, context }: LoaderArgs) => {
  const client = await getClient(context);

  const {
    music: { findManyArtist, findManyGenre },
  } = await client.query({
    music: {
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
    },
  });

  return {
    artists: findManyArtist,
    genres: findManyGenre,
  };
};

export const action = async ({ request, context }: ActionArgs) =>
  formAction({
    request,
    schema: createAlbumSchema,
    mutation: createAlbumMutation,
    successPath: "/music",
    environment: context,
  });

export default function MusicAdd() {
  const { genres, artists } = useLoaderData<typeof loader>();

  return (
    <div className="flex justify-center w-full">
      <Form
        schema={createAlbumSchema}
        className="space-y-4 w-full max-w-2xl"
        method="post"
        options={{
          genre: genres.map((artist) => ({
            name: artist.name,
            value: artist.id,
          })),
          artist: artists.map((artist) => ({
            name: artist.name,
            value: artist.id,
          })),
          year: years.map((year) => ({
            name: year,
            value: year,
          })),
        }}
      >
        {({ Field, Errors, Button, setValue, submit }) => {
          return (
            <Fragment>
              <Field name="name" label="Name" />
              <Field name="artist" hidden />
              <Field name="genre" hidden />
              <Field name="year" hidden />
              <Field name="artist" label="Artist">
                {({ options, Label, Error }) => (
                  <Fragment>
                    <Label />
                    <ComboboxInput
                      label={`Artist`}
                      options={options}
                      setValueChange={(value) => {
                        setValue("artist", value, {
                          shouldValidate: false,
                          shouldDirty: true,
                          shouldTouch: false,
                        });
                      }}
                    />
                    <Error />
                  </Fragment>
                )}
              </Field>
              <Field name="genre" label="Genre">
                {({ options, label, Label, Errors, value }) => (
                  <Fragment>
                    <Label />
                    <SelectInput
                      label={label}
                      options={options}
                      setValueChange={(value) => {
                        setValue("genre", value, {
                          shouldValidate: true,
                          shouldDirty: true,
                          shouldTouch: true,
                        });
                      }}
                    />
                    <Errors />
                  </Fragment>
                )}
              </Field>
              <Field name="year" label="Release Year">
                {({ options, Label, Error }) => (
                  <Fragment>
                    <Label />
                    <SelectInput
                      label={`Year`}
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
              <Button className="w-full">Save</Button>
            </Fragment>
          );
        }}
      </Form>
    </div>
  );
}
