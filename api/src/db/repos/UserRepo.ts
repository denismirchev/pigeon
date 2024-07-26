import { users, IUser } from '@src/db/models/User';
import { db } from '@src/db/setup';
import { eq } from 'drizzle-orm';

class UserRepo {
  private db;

  public constructor() {
    this.db = db;
  }

  public async create(user: IUser): Promise<void> {
    await this.db.insert(users).values(user);
  }

  public async getOne(email: string): Promise<IUser | null> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));

    return user ? (user as IUser) : null;
  }
}

export default new UserRepo();