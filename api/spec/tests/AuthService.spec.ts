import AuthService from '@src/services/AuthService';
import UserRepo from '@src/db/repos/UserRepo';
import RefreshTokenRepo from '@src/db/repos/RefreshTokenRepo';

describe('AuthService', () => {
  const email = 'test@example.com';
  const password = 'password123';
  const nickname = 'Test User';
  const username = 'testuser';

  beforeEach(async () => {
    await UserRepo.deleteUserByEmail(email);
  });

  describe('register', () => {
    it('should create a new user', async () => {
      await AuthService.register(email, password, nickname, username);
      const createdUser = await UserRepo.getUserByEmail(email);
      expect(createdUser?.email).toEqual(email);
    });

    it('should throw an error if the email is already in use', async () => {
      await AuthService.register(email, password, nickname, username);
      await expectAsync(
        AuthService.register(email, password, nickname, username),
      ).toBeRejectedWithError();
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      await AuthService.register(email, password, nickname, username);
    });

    it('should login and retrieve access and refresh tokens', async () => {
      const user = await AuthService.login(email, password);
      expect(user.email).toEqual(email);
      const tokens = await AuthService.createTokens(user);
      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();
    });

    it('should reject login with wrong password', async () => {
      const wrongPassword = 'wrongpassword';
      await expectAsync(
        AuthService.login(email, wrongPassword),
      ).toBeRejectedWithError();
    });

    it('should reject login for a non-existent email', async () => {
      const nonExistentEmail = 'nonexistent@example.com';
      await expectAsync(
        AuthService.login(nonExistentEmail, password),
      ).toBeRejectedWithError();
    });
  });

  describe('refreshToken', () => {
    beforeEach(async () => {
      await AuthService.register(email, password, nickname, username);
    });

    // eslint-disable-next-line max-len
    it('should return a new access token when a valid refresh token is provided', async () => {
      const user = await AuthService.login(email, password);
      const tokens = await AuthService.createTokens(user);

      const accessToken = await AuthService.refreshAccessToken(
        tokens.refreshToken,
      );
      expect(accessToken).toBeDefined();
      expect(typeof accessToken).toBe('string');
    });

    it('should reject invalid refresh tokens', async () => {
      const invalidRefreshToken = 'invalidtoken';
      await expectAsync(
        AuthService.refreshAccessToken(invalidRefreshToken),
      ).toBeRejectedWithError();
    });
  });

  describe('logout', () => {
    let tokens: { accessToken: string; refreshToken: string };

    beforeEach(async () => {
      await AuthService.register(email, password, nickname, username);
      const user = await AuthService.login(email, password);
      tokens = await AuthService.createTokens(user);
    });

    it('should delete the refresh token on logout', async () => {
      await AuthService.logout(tokens.refreshToken);
      const tokenExists = await RefreshTokenRepo.getOneByToken(
        tokens.refreshToken,
      );
      expect(tokenExists).toBeNull();
    });

    it('should throw an error if the token is invalid', async () => {
      const invalidToken = 'invalidtoken';
      await expectAsync(
        AuthService.logout(invalidToken),
      ).toBeRejectedWithError();
    });
  });
});
