import { generate } from "@genql/cli";
import path from "path";
import * as dotenv from "dotenv";

(async () => {
  const envPath = path.join(__dirname, "../.dev.vars");
  dotenv.config({ path: envPath });

  generate({
    endpoint: process.env.GRAPHQL_ENDPOINT,
    headers: {
      Authorization: process.env.GRAPHQL_AUTH!,
    },
    output: path.join(__dirname, "../app/@types/gen"),
  }).catch((reason) => {
    console.log(reason);
  });
})();
