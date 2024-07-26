import { pgTable, serial, varchar, text } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  pwdHash: text('pwdHash').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull(),
  created: text('created').notNull(),
});

export interface IUser {
  id: number;
  email: string;
  pwdHash: string;
  name: string;
  role: string;
  created: string;
}