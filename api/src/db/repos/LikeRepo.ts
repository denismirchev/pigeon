import { db } from '@src/db/setup';
import {ILike, likes} from '@src/db/models/Like';
import {and, desc, eq, isNull} from 'drizzle-orm';

class LikeRepo {
  private db;

  public constructor() {
    this.db = db;
  }

  public async create(like: ILike) {
    await this.db.insert(likes).values(like);
  }

  public async delete(postId: number, userId: number) {
    await this.db.delete(likes).where(
      and(
        eq(likes.postId, postId),
        eq(likes.userId, userId),
      ),
    );
  }

  public async deleteById(id: number): Promise<void> {
    await this.db.delete(likes).where(eq(likes.id, id));
  }

  public async get(postId: number, userId: number): Promise<ILike | null> {
    const [like] = await this.db
      .select()
      .from(likes)
      .where(
        and(
          eq(likes.postId, postId),
          eq(likes.userId, userId),
        ),
      );
    return like ? (like as ILike) : null;
  }
}

export default new LikeRepo();