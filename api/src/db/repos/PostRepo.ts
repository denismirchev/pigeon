import { db } from '@src/db/setup';
import {IPost, IPostJoins, posts} from '@src/db/models/Post';
import { and, desc, eq, isNull, notInArray, sql } from 'drizzle-orm';
import { DEFAULT_POSTS_LIMIT } from '@src/config';
import {users} from '@src/db/models/User';
import {likes} from '@src/db/models/Like';

class PostRepo {
  private db;

  public constructor() {
    this.db = db;
  }

  public async create(post: IPost) {
    await this.db.insert(posts).values(post);
  }

  public async getPosts(
    parentId?: number,
    offset: number = 0,
    limit: number = DEFAULT_POSTS_LIMIT,
    excludedIds: number[] = [],
  ): Promise<IPostJoins[]> {
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
      .offset(offset)
      .limit(limit)
      .orderBy(desc(posts.createdAt));

    return query as IPostJoins[];
  }

  public async getPost(id: number): Promise<IPostJoins | null> {
    const [post] = await this.db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .innerJoin(users, eq(posts.userId, users.id))
      .leftJoin(likes, and(
        eq(posts.id, likes.postId),
        eq(likes.userId, posts.userId),
      ));

    return post as IPostJoins || null;
  }

  public async getPostByUserId(userId: number): Promise<IPost[]> {
    return await this.db
      .select()
      .from(posts)
      .where(eq(posts.userId, userId)) as IPost[];
  }

  public async getPostParents(id: number): Promise<IPost[]> {
    // the sql statement is correct
    const parents = await this.db.execute(sql`
      WITH RECURSIVE ParentPosts AS (
        SELECT * FROM posts WHERE id = ${id}
        UNION ALL
          SELECT p.* FROM posts p
          INNER JOIN ParentPosts pp ON p.id = pp.parent_id
        )
      SELECT * FROM ParentPosts;
  `) as unknown as never[];

    const res: never[] = parents[0];
    res.shift();
    return this.convertKeysToCamelCase(res) as IPost[];
  }

  public async deletePostById(id: number): Promise<void> {
    await this.db.delete(posts).where(eq(posts.id, id));
  }

  public async getLast(): Promise<IPostJoins | null> {
    const [post] = await this.db
      .select()
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .orderBy(desc(posts.id))
      .limit(1);

    return post as IPostJoins || null;
  }

  public async incLikeCount(id: number) {
    await this.db.update(posts)
      .set({ likesCount: sql`${posts.likesCount} + 1` })
      .where(eq(posts.id, id));
  }

  public async decLikeCount(id: number) {
    await this.db.update(posts)
      .set({ likesCount: sql`${posts.likesCount} - 1` })
      .where(eq(posts.id, id));
  }

  public async incReplyCount(id: number) {
    await this.db.update(posts)
      .set({ repliesCount: sql`${posts.repliesCount} + 1` })
      .where(eq(posts.id, id));
  }

  public async decReplyCount(id: number) {
    await this.db.update(posts)
      .set({ repliesCount: sql`${posts.repliesCount} - 1` })
      .where(eq(posts.id, id));
  }

  public async incRepostCount(id: number) {
    await this.db.update(posts)
      .set({ repostsCount: sql`${posts.repostsCount} + 1` })
      .where(eq(posts.id, id));
  }

  public async decRepostCount(id: number) {
    await this.db.update(posts)
      .set({ repostsCount: sql`${posts.repostsCount} - 1` })
      .where(eq(posts.id, id));
  }

  private toCamelCase(snakeCaseString: string): string {
    return snakeCaseString.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
  }

  private convertKeysToCamelCase(obj: unknown): unknown {
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
  }
}

export default new PostRepo();
