import { db } from '@src/db/setup';
import { IPost, posts } from '@src/db/models/Post';
import { eq } from 'drizzle-orm';

class PostRepo {
  private db;

  public constructor() {
    this.db = db;
  }

  public async create(post: IPost): Promise<void> {
    await this.db.insert(posts).values(post);
  }

  public async getAll(): Promise<IPost[]> {
    return await this.db.select().from(posts) as IPost[];
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
}

export default new PostRepo();