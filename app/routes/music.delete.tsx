import type { ActionArgs } from "@remix-run/cloudflare";
import { formAction } from "~/components/forms/form.action";
import { deleteAlbumMutation } from "~/graphql/Music/mutations.server";
import { deleteAlbumSchema } from "~/graphql/Music/schema";

export const action = async ({ request, context }: ActionArgs) =>
  formAction({
    request,
    schema: deleteAlbumSchema,
    mutation: deleteAlbumMutation,
    successPath: "/music",
    environment: context,
  });
