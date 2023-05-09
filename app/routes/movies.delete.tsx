import type { ActionArgs } from "@remix-run/cloudflare";
import { formAction } from "~/components/forms/form.action";
import { deleteMovieMutation } from "~/graphql/Movies/mutations.server";
import { deleteMovieSchema } from "~/graphql/Movies/schema";

export const action = async ({ request, context }: ActionArgs) =>
  formAction({
    request,
    schema: deleteMovieSchema,
    mutation: deleteMovieMutation,
    successPath: "/movies",
    environment: context,
  });
