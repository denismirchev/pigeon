import UserRepo from '@src/db/repos/UserRepo';
import PwdUtil from '@src/util/PwdUtil';
import { tick } from '@src/util/misc';
import {
  extractEntryFromSqlMessage,
  extractFieldFromSqlMessage,
  isDatabaseError,
} from '@src/db/utils';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import RouteError from '@src/common/RouteError';
import jwt from 'jsonwebtoken';
import { IUser } from '@src/db/models/User';
import RefreshTokenRepo from '@src/db/repos/RefreshTokenRepo';
import { IRefreshToken } from '@src/db/models/RefreshToken';
import EnvVars from '@src/common/EnvVars';
import ErrorsUtil from '@src/common/errors';

export const Errors = {
  Unauthorized: 'User is unauthorized',
  EmailNotFound(email: string) {
    return `User with email "${email}" not found`;
  },
  EmailInUse(email: string) {
    return `User with email "${email}" already exists`;
  },
  FieldAlreadyExists(field: string, value: string) {
    return `${field} "${value}" already exists`;
  },
} as const;

class AuthService {
  public login = async (email: string, password: string) => {
    const user = await UserRepo.getUserByEmail(email);
    if (!user) {
      throw new RouteError(
        ErrorsUtil.InvalidUserDetails.status,
        ErrorsUtil.InvalidUserDetails.message,
      );
    }

    const hash = user.passwordHash;
    const isPasswordValid = await PwdUtil.compare(password, hash);
    if (!isPasswordValid) {
      await tick(500);
      throw new RouteError(
        ErrorsUtil.InvalidUserDetails.status,
        ErrorsUtil.InvalidUserDetails.message,
      );
    }

    return user;
  };

  public createTokens = async (user: IUser) => {
    if (!user.id) {
      throw new RouteError(
        ErrorsUtil.UnexpectedError.status,
        ErrorsUtil.UnexpectedError.message,
      );
    }

    if (await RefreshTokenRepo.getOneByUserId(user.id)) {
      await RefreshTokenRepo.deleteByUserId(user.id);
    }

    const accessToken = jwt.sign(user, EnvVars.Jwt.AccessSecret, {
      expiresIn: '1h',
    });
    const expiresInDays = 30;
    const refreshToken: IRefreshToken = {
      userId: user.id,
      token: jwt.sign(user, EnvVars.Jwt.RefreshSecret, {
        expiresIn: `${expiresInDays}d`,
      }),
      expiresAt: new Date(
        Date.now() + expiresInDays * 24 * 60 * 60 * 1000,
      ),
    };

    await RefreshTokenRepo.create(refreshToken);

    return {
      accessToken,
      refreshToken: refreshToken.token,
    };
  };

  public register = async (
    email: string,
    password: string,
    name: string,
    username: string,
  ): Promise<IUser> => {
    const passwordHash = await PwdUtil.getHash(password);

    const newUser: IUser = {
      email,
      name,
      username,
      passwordHash,
    };

    try {
      await UserRepo.create(newUser);
    } catch (err) {
      if (isDatabaseError(err) && err.code === 'ER_DUP_ENTRY') {
        const entry = extractEntryFromSqlMessage(err.sqlMessage);
        const field = extractFieldFromSqlMessage(err.sqlMessage);
        throw new RouteError(
          HttpStatusCodes.CONFLICT,
          Errors.FieldAlreadyExists(field, entry),
        );
      }
      throw err;
    }

    return newUser;
  };

  public logout = async (token: string) => {
    if (!await RefreshTokenRepo.getOneByToken(token)) {
      throw new RouteError(HttpStatusCodes.FORBIDDEN, 'Token not found');
    }
    await RefreshTokenRepo.deleteByToken(token);
  };

  public refreshAccessToken = async (token: string) => {
    const refreshToken = await RefreshTokenRepo.getOneByToken(token);
    if (!refreshToken) {
      throw new RouteError(HttpStatusCodes.FORBIDDEN, 'Token not found');
    }
    return jwt.verify(token, EnvVars.Jwt.RefreshSecret, (err, user) => {
      if (err) {
        throw new RouteError(HttpStatusCodes.FORBIDDEN, 'Invalid token');
      }

      user = user as IUser;
      for (const key in user) {
        if (key == 'iat' || key == 'exp') {
          delete user[key];
        }
      }

      return jwt.sign(user as IUser, EnvVars.Jwt.AccessSecret, {
        expiresIn: '1h',
      });
    });
  };

  public removeExpiredTokens = async () => {
    await RefreshTokenRepo.deleteExpiredTokens();
  };
}

export default new AuthService();