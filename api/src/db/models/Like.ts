import {
  bigint, mysqlTable, timestamp, uniqueIndex,
} from 'drizzle-orm/mysql-core';
import { posts } from '@src/db/models/Post';
import { users } from '@src/db/models/User';

export const likes = mysqlTable('likes', {
  id: bigint('id', { mode: 'number', unsigned: true })
    .autoincrement()
    .primaryKey(),
  userId: bigint('user_id', { mode: 'number', unsigned: true })
    .notNull()
    .references(() => users.id),
  postId: bigint('post_id', { mode: 'number', unsigned: true })
    .notNull()
    .references(() => posts.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return {
    uniqueUserPost: uniqueIndex('unique_user_post')
      .on(table.userId, table.postId),
  };
});

export interface ILike {
  id?: number;
  userId: number;
  postId: number;
  createdAt?: Date;
}