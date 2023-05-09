import { createClient } from "~/@types/gen";

export const getClient = (context: any) => {
  const { GRAPHQL_ENDPOINT, GRAPHQL_AUTH } = context;
  return createClient({
    url: GRAPHQL_ENDPOINT,
    headers: {
      Authorization: `${GRAPHQL_AUTH}`,
    },
  });
};
