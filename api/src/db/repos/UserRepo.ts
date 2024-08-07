import { users, IUser } from '@src/db/models/User';
import { db } from '@src/db/setup';
import { eq } from 'drizzle-orm';
import {inArray} from 'drizzle-orm/sql/expressions/conditions';

class UserRepo {
  private db;

  public constructor() {
    this.db = db;
  }

  public async create(user: IUser): Promise<void> {
    await this.db.insert(users).values(user);
  }

  public async getUserByEmail(email: string): Promise<IUser | null> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));

    return user ? (user as IUser) : null;
  }

  public async getUserByUsername(username: string): Promise<IUser | null> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.username, username));

    return user ? (user as IUser) : null;
  }

  public async getUserById(id: number): Promise<IUser | null> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id));

    return user ? (user as IUser) : null;
  }

  public async getUsersByIds(ids: number[]): Promise<IUser[]> {
    const fetchedUsers = await db
      .select()
      .from(users)
      .where(inArray(users.id, ids));

    return fetchedUsers as IUser[];
  }
}

export default new UserRepo();