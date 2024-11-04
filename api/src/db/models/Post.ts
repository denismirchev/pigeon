import {
  AnyMySqlColumn, bigint, mysqlTable, text, timestamp,
} from 'drizzle-orm/mysql-core';
import {IUser} from '@src/db/models/User';
import {ILike} from '@src/db/models/Like';

export const posts = mysqlTable('posts', {
  id: bigint('id', { mode: 'number', unsigned: true })
    .autoincrement()
    .primaryKey(),
  userId: bigint('user_id', { mode: 'number', unsigned: true }).notNull(),
  content: text('content').notNull(),
  attachments: text('attachments'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  parentId: bigint('parent_id', { mode: 'number', unsigned: true })
    .references((): AnyMySqlColumn => posts.id),
  repostId: bigint('repost_id', { mode: 'number', unsigned: true })
    .references((): AnyMySqlColumn => posts.id),
  likesCount: bigint('likes_count', { mode: 'number', unsigned: true })
    .default(0),
  repliesCount: bigint('replies_count', { mode: 'number', unsigned: true })
    .default(0),
  repostsCount: bigint('reposts_count', { mode: 'number', unsigned: true })
    .default(0),
});

export interface IPost {
  id?: number;
  content: string;
  attachments?: string;
  createdAt?: Date;
  updatedAt?: Date;
  parentId?: number;
  repostId?: number;
  likesCount?: number;
  repliesCount?: number;
  repostsCount?: number;
  userId: number;
  user?: {
    id?: number;
    username: string;
    nickname: string;
    profileImageUrl?: string;
  };
  // this is for the current user
  liked?: boolean;
}

export interface IPostJoins {
  posts: IPost;
  users: IUser;
  likes?: ILike;
}
