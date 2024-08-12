import { db } from '@src/db/setup';
import { IPost, posts } from '@src/db/models/Post';
import {desc, eq, isNull} from 'drizzle-orm';

class PostRepo {
  private db;

  public constructor() {
    this.db = db;
  }

  public async create(post: IPost) {
    await this.db.insert(posts).values(post);
  }

  public async getAll(): Promise<IPost[]> {
    return await this.db
      .select()
      .from(posts)
      .where(isNull(posts.parentId)) as IPost[];
  }

  public async getOne(id: number): Promise<IPost | null> {
    const [post] = await this.db.select().from(posts).where(eq(posts.id, id));
    return post ? (post as IPost) : null;
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

  public async getPostReplies(id: number): Promise<IPost[]> {
    return await this.db
      .select()
      .from(posts)
      .where(eq(posts.parentId, id)) as IPost[];
  }

  public async getLast() {
    const [ post ]  = await this.db
      .select()
      .from(posts)
      .orderBy(desc(posts.id))
      .limit(1) as IPost[];

    return post;
  }
}

export default new PostRepo();