import { makeDomainFunction } from "domain-functions";
import {
  createMovieSchema,
  deleteMovieSchema,
  updateMovieSchema,
} from "./schema";
import { environmentSchema } from "../schema";
import { getClient } from "../client.server";

export const createMovieMutation = makeDomainFunction(
  createMovieSchema,
  environmentSchema
)(
  async (
    { director, synopsis, genre, title, year, cast },
    { GRAPHQL_AUTH, GRAPHQL_ENDPOINT }
  ) => {
    const client = await getClient({ GRAPHQL_AUTH, GRAPHQL_ENDPOINT });

    const {
      movies: { createOneMovie: movie },
    } = await client.mutation({
      movies: {
        createOneMovie: {
          __args: {
            data: {
              director,
              genre: {
                connect: {
                  id: genre,
                },
              },
              title,
              synopsis,
              year,
              cast,
            },
          },
          id: true,
        },
      },
    });

    return {
      id: movie.id,
    };
  }
);

export const updateMovieMutation = makeDomainFunction(
  updateMovieSchema,
  environmentSchema
)(
  async (
    { director, synopsis, genre, title, year, cast, id },
    { GRAPHQL_AUTH, GRAPHQL_ENDPOINT }
  ) => {
    const client = await getClient({ GRAPHQL_AUTH, GRAPHQL_ENDPOINT });

    const {
      movies: { updateOneMovie },
    } = await client.mutation({
      movies: {
        updateOneMovie: {
          __args: {
            data: {
              genre: {
                connect: {
                  id: genre,
                },
              },
              director: {
                set: director,
              },
              title: {
                set: title,
              },
              synopsis: {
                set: synopsis,
              },
              year: {
                set: year,
              },
              cast: {
                set: cast,
              },
            },
            where: {
              id: id,
            },
          },
          id: true,
        },
      },
      purgeMovie: {
        __args: {
          id: id,
        },
        id: true,
      },
    });

    return {
      id: updateOneMovie.id,
    };
  }
);

export const deleteMovieMutation = makeDomainFunction(
  deleteMovieSchema,
  environmentSchema
)(async ({ id }, { GRAPHQL_AUTH, GRAPHQL_ENDPOINT }) => {
  const client = await getClient({ GRAPHQL_AUTH, GRAPHQL_ENDPOINT });

  const {
    movies: { deleteOneMovie },
  } = await client.mutation({
    movies: {
      deleteOneMovie: {
        __args: {
          where: {
            id: id,
          },
        },
        id: true,
      },
    },
    purgeMovie: {
      __args: {
        id: id,
      },
      id: true,
    },
  });

  return {
    id: deleteOneMovie.id,
  };
});
