import { db } from '@src/db/setup';
import { IPost, posts } from '@src/db/models/Post';
import { desc, eq, isNull, sql } from 'drizzle-orm';

class PostRepo {
  private db;

  public constructor() {
    this.db = db;
  }

  public async create(post: IPost) {
    await this.db.insert(posts).values(post);
  }

  public async getAll(offset?: number, limit?: number): Promise<IPost[]> {
    return await this.db
      .select()
      .from(posts)
      .where(isNull(posts.parentId))
      .orderBy(desc(posts.createdAt))
      .offset(offset ? offset : 0)
      .limit(limit ? limit : 10) as IPost[];
  }

  public async getOne(id: number): Promise<IPost | null> {
    const [post] = await this.db.select().from(posts).where(eq(posts.id, id));
    return post ? (post as IPost) : null;
  }

  public async getOneParents(id: number): Promise<IPost[]> {
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

  public async getByUserId(userId: number): Promise<IPost[]> {
    return await this.db
      .select()
      .from(posts)
      .where(eq(posts.userId, userId)) as IPost[];
  }

  public async deleteById(id: number): Promise<void> {
    await this.db.delete(posts).where(eq(posts.id, id));
  }

  public async getPostReplies(id: number, offset?: number, limit?: number)
    : Promise<IPost[]> {
    return await this.db
      .select()
      .from(posts)
      .where(eq(posts.parentId, id))
      .orderBy(desc(posts.createdAt))
      .offset(offset ? offset : 0)
      .limit(limit ? limit : 10) as IPost[];
  }

  public async getLast() {
    const [ post ]  = await this.db
      .select()
      .from(posts)
      .orderBy(desc(posts.id))
      .limit(1) as IPost[];

    return post;
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
