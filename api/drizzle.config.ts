import { defineConfig } from 'drizzle-kit';
import { DB_URL } from '@src/config';

export default defineConfig({
  schema: './src/db/models/*',
  out: './src/db/migrations',
  dbCredentials: {
    url: DB_URL,
  },
  dialect: 'mysql',
});