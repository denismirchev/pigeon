/**
 * Environments variables declared here.
 */

/* eslint-disable node/no-process-env */


export default {
  NodeEnv: (process.env.NODE_ENV ?? ''),
  Port: (process.env.PORT ?? 0),
  Jwt: {
    AccessSecret: (process.env.ACCESS_TOKEN_SECRET ?? ''),
    RefreshSecret: (process.env.REFRESH_TOKEN_SECRET ?? ''),
  },
  Db: {
    Url: (process.env.DB_URL ?? ''),
  },
  Posts: {
    DefaultLimit: Number(process.env.DEFAULT_POSTS_LIMIT ?? 10),
  },
  RootDir: process.cwd(),
} as const;
