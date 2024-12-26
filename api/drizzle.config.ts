import { defineConfig } from 'drizzle-kit';
import EnvVars from '@src/common/EnvVars';

export default defineConfig({
  schema: './src/db/models/*',
  out: './src/db/migrations',
  dbCredentials: {
    url: EnvVars.Db.Url,
  },
  dialect: 'mysql',
});