import { db } from '@src/db/setup';
import { IPost, IPostJoins, posts } from '@src/db/models/Post';
import { and, desc, eq, isNull, notInArray, sql } from 'drizzle-orm';
import { DEFAULT_POSTS_LIMIT } from '@src/config';
import { users } from '@src/db/models/User';
import { likes } from '@src/db/models/Like';
import { alias } from 'drizzle-orm/mysql-core';

class PostRepo {
  private db;

  public constructor() {
    this.db = db;
  }

  public create = async (post: IPost) => {
    await this.db.insert(posts).values(post);
  };

  public getPosts = async (
    parentId?: number,
    offset: number = 0,
    limit: number = DEFAULT_POSTS_LIMIT,
    excludedIds: number[] = [],
  ): Promise<IPostJoins[]> => {
    const conditions = parentId
      ? and(eq(posts.parentId, parentId), notInArray(posts.id, excludedIds))
      : and(isNull(posts.parentId), notInArray(posts.id, excludedIds));

    const query = await db
      .select()
      .from(posts)
      .where(conditions)
      .innerJoin(users, eq(posts.userId, users.id))
      .leftJoin(likes, and(
        eq(posts.id, likes.postId),
        eq(likes.userId, posts.userId)),
      )
      .leftJoin(alias(posts, 'repost'),
        eq(posts.repostId, alias(posts, 'repost').id),
      )
      .leftJoin(alias(users, 'repostUser'),
        eq(alias(posts, 'repost').userId, users.id),
      )
      .offset(offset)
      .limit(limit)
      .orderBy(desc(posts.createdAt));

    return query as IPostJoins[];
  };

  public getPost = async (id: number): Promise<IPostJoins | null> => {
    const [post] = await this.db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .innerJoin(users, eq(posts.userId, users.id))
      .leftJoin(likes, and(
        eq(posts.id, likes.postId),
        eq(likes.userId, posts.userId),
      ))
      .leftJoin(alias(posts, 'repost'),
        eq(posts.repostId, alias(posts, 'repost').id),
      )
      .leftJoin(alias(users, 'repostUser'),
        eq(alias(posts, 'repost').userId, users.id),
      );

    return post as IPostJoins || null;
  };

  public getPostByUserId = async (userId: number): Promise<IPost[]> => {
    return await this.db
      .select()
      .from(posts)
      .where(eq(posts.userId, userId)) as IPost[];
  };

  /* eslint-disable */
  public getPostParents = async (id: number): Promise<IPost[]> => {
    const parents = await this.db.execute(sql`
      WITH RECURSIVE ParentPosts AS (
        SELECT * FROM posts WHERE id = ${id}
        UNION ALL
          SELECT p.* FROM posts p
          INNER JOIN ParentPosts pp ON p.id = pp.parent_id
      )
      SELECT ParentPosts.*, 
        users.username AS user_username,
        users.name AS user_nickname,
        users.profile_image_url AS user_profile_image_url,
        likes.id AS like_id
      FROM ParentPosts
      LEFT JOIN users ON ParentPosts.user_id = users.id
      LEFT JOIN likes ON ParentPosts.id = likes.post_id AND ParentPosts.user_id = likes.user_id;
  `) as unknown as never[];

    const response: any[] = parents[0];
    response.shift();

    const result = response.map((post) => {
      const {
        user_id,
        user_username,
        user_nickname,
        user_profile_image_url,
        like_id,
        ...rest
      } = post;

      return {
        ...rest,
        user: {
          id: user_id,
          username: user_username,
          nickname: user_nickname,
          profileImageUrl: user_profile_image_url,
        },
        liked: !!like_id,
      };
    });

    return this.convertKeysToCamelCase(result) as IPost[];
  };
  /* eslint-enable */

  public deletePostById = async (id: number): Promise<void> => {
    await this.db.delete(posts).where(eq(posts.id, id));
  };

  public getLast = async (): Promise<IPostJoins | null> => {
    const [post] = await this.db
      .select()
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .orderBy(desc(posts.id))
      .limit(1);

    return post as IPostJoins || null;
  };

  public incLikeCount = async (id: number) => {
    await this.db.update(posts)
      .set({ likesCount: sql`${posts.likesCount} + 1` })
      .where(eq(posts.id, id));
  };

  public decLikeCount = async (id: number) => {
    await this.db.update(posts)
      .set({ likesCount: sql`${posts.likesCount} - 1` })
      .where(eq(posts.id, id));
  };

  public incReplyCount = async (id: number) => {
    await this.db.update(posts)
      .set({ repliesCount: sql`${posts.repliesCount} + 1` })
      .where(eq(posts.id, id));
  };

  public decReplyCount = async (id: number) => {
    await this.db.update(posts)
      .set({ repliesCount: sql`${posts.repliesCount} - 1` })
      .where(eq(posts.id, id));
  };

  public incRepostCount = async (id: number) => {
    await this.db.update(posts)
      .set({ repostsCount: sql`${posts.repostsCount} + 1` })
      .where(eq(posts.id, id));
  };

  public decRepostCount = async (id: number) => {
    await this.db.update(posts)
      .set({ repostsCount: sql`${posts.repostsCount} - 1` })
      .where(eq(posts.id, id));
  };

  private toCamelCase = (snakeCaseString: string): string => {
    return snakeCaseString.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
  };

  private convertKeysToCamelCase = (obj: unknown): unknown => {
    if (Array.isArray(obj)) {
      return obj.map(v => this.convertKeysToCamelCase(v));
    } else if (obj && typeof obj === 'object' && obj.constructor === Object) {
      return Object.keys(obj).reduce((result, key) => {
        result[this.toCamelCase(key)] = this.convertKeysToCamelCase(
          (obj as Record<string, unknown>)[key],
        );
        return result;
      }, {} as Record<string, unknown>);
    }
    return obj;
  };
}

export default new PostRepo();
