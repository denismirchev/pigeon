import dotenv from 'dotenv';

const env = dotenv.config().parsed;

if (!env) {
  throw new Error('Environment variables not found');
}

if (!env.DB_URL) {
  throw new Error('DB credentials error');
}

export const DB_URL = env.DB_URL;