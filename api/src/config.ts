import dotenv from 'dotenv';

const env = dotenv.config().parsed;

if (!env) {
  throw new Error('Environment variables not found');
}

if (!env.DB_URL) {
  throw new Error('DB credentials error');
}

if (!env.ACCESS_TOKEN_SECRET) {
  throw new Error('Access token secret not found');
}

if (!env.REFRESH_TOKEN_SECRET) {
  throw new Error('Refresh token secret not found');
}

export const DB_URL = env.DB_URL;
export const ACCESS_TOKEN_SECRET = env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = env.REFRESH_TOKEN_SECRET;
export const ROOT_DIR = process.cwd();
export const DEFAULT_POSTS_LIMIT = Number(env.DEFAULT_POSTS_LIMIT) || 10;