import { users, IUser } from '@src/db/models/User';
import { db } from '@src/db/setup';
import { eq } from 'drizzle-orm';
import {refreshTokens} from '@src/db/models/RefreshToken';

class UserRepo {
  private db;

  public constructor() {
    this.db = db;
  }

  public create = async (user: IUser): Promise<void> => {
    await this.db.insert(users).values(user);
  };

  public getUserByEmail = async (email: string): Promise<IUser | null> => {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));

    return user ? (user as IUser) : null;
  };

  public getUserByUsername = async (username: string): Promise<IUser | null> => {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.username, username));

    return user ? (user as IUser) : null;
  };

  public getUserById = async (id: number): Promise<IUser | null> => {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id));

    return user ? (user as IUser) : null;
  };

  public updateUser = async (id: number, updates: Partial<IUser>): Promise<void> => {
    await this.db.update(users).set(updates).where(eq(users.id, id));
  };

  public deleteUserByEmail = async (email: string): Promise<void> => {
    const user = await this.getUserByEmail(email);
    if (user && user.id) {
      await this.db.delete(refreshTokens).where(
        eq(refreshTokens.userId, user.id),
      );
      await this.db.delete(users).where(eq(users.email, email));
    }
  };
}

export default new UserRepo();
