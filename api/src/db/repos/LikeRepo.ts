import { db } from '@src/db/setup';
import { ILike, likes } from '@src/db/models/Like';
import { and, eq } from 'drizzle-orm';

class LikeRepo {
  private db;

  public constructor() {
    this.db = db;
  }

  public create = async (like: ILike) => {
    await this.db.insert(likes).values(like);
  };

  public delete = async (postId: number, userId: number) => {
    await this.db.delete(likes).where(
      and(
        eq(likes.postId, postId),
        eq(likes.userId, userId),
      ),
    );
  };

  public deleteById = async (id: number): Promise<void> => {
    await this.db.delete(likes).where(eq(likes.id, id));
  };

  public get = async (
    postId: number,
    userId: number,
  ): Promise<ILike | null> => {
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
  };
}

export default new LikeRepo();