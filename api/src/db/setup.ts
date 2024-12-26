import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2';
import EnvVars from '@src/common/EnvVars';

const connection = mysql.createConnection(EnvVars.Db.Url);

export const db = drizzle(connection);