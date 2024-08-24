import {
  bigint,
  mysqlTable,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { users } from './User';

export const refreshTokens = mysqlTable('refresh_tokens', {
  id: bigint('id', { mode: 'number', unsigned: true })
    .autoincrement()
    .primaryKey(),
  userId: bigint('user_id', { mode: 'number', unsigned: true })
    .notNull()
    .references(() => users.id),
  token: varchar('token', { length: 1024 }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export interface IRefreshToken {
  id?: number;
  userId: number;
  token: string;
  expiresAt: Date;
  createdAt?: Date;
}