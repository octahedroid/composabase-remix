import type { ActionArgs, LoaderArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { Fragment } from "react";
import { Form } from "~/components/forms/form";
import { formAction } from "~/components/forms/form.action";
import { SelectInput } from "~/components/forms/select";
import { createAlbumMutation } from "~/graphql/Music/mutations.server";
import { createAlbumSchema } from "~/graphql/Music/schema";
import { getClient } from "~/graphql/client.server";

export const loader = async ({ request, context }: LoaderArgs) => {
  const client = await getClient(context);

  const {
    music: { findManyArtist: artists, findManyGenre: genres },
  } = await client.query({
    music: {
      findManyArtist: {
        id: true,
        name: true,
      },
      findManyGenre: {
        id: true,
        name: true,
      },
    },
  });

  return {
    artists,
    genres,
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
  const { genres } = useLoaderData<typeof loader>();

  return (
    <main className="flex justify-center w-full">
      <Form
        schema={createAlbumSchema}
        className="space-y-4 w-full max-w-2xl"
        method="post"
        options={{
          genres: genres.map((artist) => ({
            name: artist.name,
            value: artist.id,
          })),
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
    </main>
  );
}
