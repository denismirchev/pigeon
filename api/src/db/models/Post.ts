import {
  bigint,
  mysqlTable,
  text,
  timestamp,
} from 'drizzle-orm/mysql-core';

export const posts = mysqlTable('posts', {
  id: bigint('id', { mode: 'number', unsigned: true })
    .autoincrement()
    .primaryKey(),
  userId: bigint('user_id', { mode: 'number', unsigned: true }).notNull(),
  content: text('content').notNull(),
  attachments: text('attachments'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export interface IPost {
  id?: number;
  userId: number;
  content: string;
  attachments?: string;
  createdAt?: Date;
  updatedAt?: Date;
}