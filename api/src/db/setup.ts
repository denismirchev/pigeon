import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2';
import { DB_URL } from '@src/config';

const connection = mysql.createConnection(DB_URL);

export const db = drizzle(connection);