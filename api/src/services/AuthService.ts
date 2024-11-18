import UserRepo from '@src/db/repos/UserRepo';
import PwdUtil from '@src/util/PwdUtil';
import { tick } from '@src/util/misc';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '@src/config';
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

// **** Variables **** //

// Errors
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


// **** Functions **** //

/**
 * Login a user.
 */
async function login(email: string, password: string) {
  const user = await UserRepo.getUserByEmail(email);
  if (!user) {
    throw new RouteError(
      HttpStatusCodes.UNAUTHORIZED,
      Errors.EmailNotFound(email),
    );
  }

  const hash = user.passwordHash ?? '';
  const passwordPassed = await PwdUtil.compare(password, hash);
  if (!passwordPassed) {
    await tick(500);
    throw new RouteError(HttpStatusCodes.UNAUTHORIZED, Errors.Unauthorized);
  }

  return user;
}

/**
 * Create tokens.
 */
async function createTokens(user: IUser) {
  if (!user.id) {
    throw new Error('User must have an id to create a refresh token');
  }

  if (await RefreshTokenRepo.getOneByUserId(user.id)) {
    await RefreshTokenRepo.deleteByUserId(user.id);
  }

  const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  const expiresInDays = 30;
  const refreshToken: IRefreshToken = {
    userId: user.id,
    token: jwt.sign(
      user,
      REFRESH_TOKEN_SECRET,
      { expiresIn: `${expiresInDays}d` },
    ),
    expiresAt: new Date(Date.now() + (expiresInDays * 24 * 60 * 60 * 1000)),
  };

  await RefreshTokenRepo.create(refreshToken);

  return {
    accessToken,
    refreshToken: refreshToken.token,
  };
}

/**
 * Register a new user.
 */
async function register(email: string, password: string, name: string, username: string): Promise<IUser> {
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
}

/**
 * Logout user.
 */
async function logout(token: string) {
  if (!await RefreshTokenRepo.getOneByToken(token)) {
    throw new RouteError(HttpStatusCodes.FORBIDDEN, 'Token not found');
  }
  await RefreshTokenRepo.deleteByToken(token);
}

/**
 * Refresh access token.
 */
async function refreshAccessToken(token: string) {
  const refreshToken = await RefreshTokenRepo.getOneByToken(token);
  if (!refreshToken) {
    throw new RouteError(HttpStatusCodes.FORBIDDEN, 'Token not found');
  }
  return jwt.verify(token, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      throw new RouteError(HttpStatusCodes.FORBIDDEN, 'Invalid token');
    }

    user = user as IUser;
    for (const key in user) {
      if (key == 'iat' || key == 'exp') {
        delete user[key];
      }
    }

    return jwt.sign(user as IUser, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  });
}

const removeExpiredTokens = async () => {
  await RefreshTokenRepo.deleteExpiredTokens();
};

// **** Export default **** //

export default {
  createTokens,
  login,
  register,
  logout,
  refreshAccessToken,
  removeExpiredTokens,
} as const;