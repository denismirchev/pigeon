import { db } from '@src/db/setup';
import { refreshTokens, IRefreshToken } from '@src/db/models/RefreshToken';
import { eq, lt } from 'drizzle-orm';

class RefreshTokenRepo {
  private db;

  public constructor() {
    this.db = db;
  }

  public create = async (refreshToken: IRefreshToken) => {
    await this.db.insert(refreshTokens).values(refreshToken);
  };

  public getOneByUserId = async (userId: number)
  : Promise<IRefreshToken | null> => {
    const [refreshToken] = await this.db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.userId, userId));

    return refreshToken ? (refreshToken as IRefreshToken) : null;
  };

  public getOneByToken = async (token: string)
  : Promise<IRefreshToken | null> => {
    const [refreshToken] = await this.db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.token, token));

    return refreshToken ? (refreshToken as IRefreshToken) : null;
  };

  public deleteByUserId = async (userId: number) => {
    await this.db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
  };

  public deleteByToken = async (token: string) => {
    await this.db.delete(refreshTokens).where(eq(refreshTokens.token, token));
  };

  public deleteExpiredTokens = async () => {
    await this.db.delete(refreshTokens).where(
      lt(refreshTokens.expiresAt, new Date()),
    );
  };
}

export default new RefreshTokenRepo();