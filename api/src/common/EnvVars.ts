/**
 * Environments variables declared here.
 */

/* eslint-disable node/no-process-env */


export default {
  NodeEnv: (process.env.NODE_ENV ?? ''),
  Port: (process.env.PORT ?? 0),
  CookieProps: {
    Key: 'ExpressGeneratorTs',
    Secret: (process.env.COOKIE_SECRET ?? ''),
    // Casing to match express cookie options
    Options: {
      httpOnly: true,
      signed: true,
      path: (process.env.COOKIE_PATH ?? ''),
      maxAge: Number(process.env.COOKIE_EXP ?? 0),
      domain: (process.env.COOKIE_DOMAIN ?? ''),
      secure: (process.env.SECURE_COOKIE === 'true'),
    },
  },
  Jwt: {
    Secret: (process.env.JWT_SECRET ??  ''),
    Exp: (process.env.COOKIE_EXP ?? ''), // exp at the same time as the cookie
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
