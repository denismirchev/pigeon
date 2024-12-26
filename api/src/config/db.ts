import { createConnection } from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';

async function initializeDb() {
  const connection = await createConnection({
    host: 'localhost',
    user: 'your-username',
    password: 'your-password',
    database: 'your-database',
  });

  return drizzle(connection);
}

let db;
(async () => {
  db = await initializeDb();
})();

export { db };