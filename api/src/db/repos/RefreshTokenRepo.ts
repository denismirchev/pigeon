import { db } from '@src/db/setup';
import { refreshTokens, IRefreshToken } from '@src/db/models/RefreshToken';
import { eq } from 'drizzle-orm';

class RefreshTokenRepo {
  private db;

  public constructor() {
    this.db = db;
  }

  public async create(refreshToken: IRefreshToken) {
    await this.db.insert(refreshTokens).values(refreshToken);
  }

  public async getOneByUserId(userId: number): Promise<IRefreshToken | null> {
    const [refreshToken] = await this.db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.userId, userId));

    return refreshToken ? (refreshToken as IRefreshToken) : null;
  }

  public async getOneByToken(token: string): Promise<IRefreshToken | null> {
    const [refreshToken] = await this.db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.token, token));

    return refreshToken ? (refreshToken as IRefreshToken) : null;
  }

  public async deleteByUserId(userId: number) {
    await this.db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
  }

  public async deleteByToken(token: string) {
    await this.db.delete(refreshTokens).where(eq(refreshTokens.token, token));
  }
}

export default new RefreshTokenRepo();