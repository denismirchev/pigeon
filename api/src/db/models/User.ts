import {
  bigint,
  mysqlTable,
  timestamp,
  varchar,
  text,
} from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: bigint('id', { mode: 'number', unsigned: true })
    .autoincrement()
    .primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  bio: text('bio'),
  location: varchar('location', { length: 100 }),
  website: varchar('website', { length: 100 }),
  profileImageUrl: varchar('profile_image_url', { length: 256 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});