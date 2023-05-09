import { createFormAction } from "remix-forms";
import { redirect, json } from "@remix-run/cloudflare";

const formAction = createFormAction({ redirect, json });

export { formAction };
