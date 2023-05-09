import { makeDomainFunction } from "domain-functions";
import {
  createAlbumSchema,
  deleteAlbumSchema,
  updateAlbumSchema,
} from "./schema";
import { environmentSchema } from "../schema";
import { getClient } from "../client.server";

export const createAlbumMutation = makeDomainFunction(
  createAlbumSchema,
  environmentSchema
)(
  async (
    { name, artist, genres, recordLabel, year },
    { GRAPHQL_AUTH, GRAPHQL_ENDPOINT }
  ) => {
    const client = await getClient({ GRAPHQL_AUTH, GRAPHQL_ENDPOINT });

    const {
      music: { findFirstArtist },
    } = await client.query({
      music: {
        findFirstArtist: {
          __args: {
            where: {
              name: {
                equals: artist,
              },
            },
          },
          name: true,
        },
      },
    });

    const {
      music: { createOneAlbum },
    } = await client.mutation({
      music: {
        createOneAlbum: {
          __args: {
            data: {
              artist: {
                connectOrCreate: {
                  where: {
                    name: findFirstArtist?.name || artist,
                  },
                  create: {
                    name: artist,
                  },
                },
              },
              genre: {
                connect: {
                  id: genres,
                },
              },
              name,
              label: recordLabel,
              year,
              members: name,
            },
          },
          id: true,
        },
      },
    });

    return {
      id: createOneAlbum.id,
    };
  }
);

export const updateAlbumMutation = makeDomainFunction(
  updateAlbumSchema,
  environmentSchema
)(
  async (
    { id, name, artist, genres, recordLabel, year },
    { GRAPHQL_AUTH, GRAPHQL_ENDPOINT }
  ) => {
    const client = await getClient({ GRAPHQL_AUTH, GRAPHQL_ENDPOINT });

    const {
      music: { findFirstArtist },
    } = await client.query({
      music: {
        findFirstArtist: {
          __args: {
            where: {
              name: {
                equals: artist,
              },
            },
          },
          name: true,
        },
      },
    });

    const {
      music: { updateOneAlbum },
    } = await client.mutation({
      music: {
        updateOneAlbum: {
          __args: {
            where: {
              id,
            },
            data: {
              artist: {
                connectOrCreate: {
                  where: {
                    name: findFirstArtist?.name || artist,
                  },
                  create: {
                    name: artist,
                  },
                },
              },
              genre: {
                connect: {
                  id: genres,
                },
              },
              name: {
                set: name,
              },
              label: {
                set: recordLabel,
              },
              year: {
                set: year,
              },
              members: {
                set: name,
              },
            },
          },
          id: true,
        },
      },
    });

    return {
      id: updateOneAlbum.id,
    };
  }
);

export const deleteAlbumMutation = makeDomainFunction(
  deleteAlbumSchema,
  environmentSchema
)(async ({ id }, { GRAPHQL_AUTH, GRAPHQL_ENDPOINT }) => {
  const client = await getClient({ GRAPHQL_AUTH, GRAPHQL_ENDPOINT });

  const {
    music: { deleteOneAlbum },
  } = await client.mutation({
    music: {
      deleteOneAlbum: {
        __args: {
          where: {
            id,
          },
        },
        id: true,
      },
    },
  });

  return {
    id: deleteOneAlbum.id,
  };
});
