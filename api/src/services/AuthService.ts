import UserRepo from '@src/repos/UserRepoBac';

import PwdUtil from '@src/util/PwdUtil';
import {tick} from '@src/util/misc';

import HttpStatusCodes from '@src/common/HttpStatusCodes';
import RouteError from '@src/common/RouteError';

import {IUser, UserRoles} from '@src/models/UserBac';


// **** Variables **** //

// Errors
export const Errors = {
  Unauth: 'Unauthorized',
  EmailNotFound(email: string) {
    return `User with email "${email}" not found`;
  },
  EmailInUse(email: string) {
    return `User with email "${email}" already exists`;
  },
} as const;


// **** Functions **** //

/**
 * Login a user.
 */
async function login(email: string, password: string): Promise<IUser> {
  // Fetch user
  const user = await UserRepo.getOne(email);
  if (!user) {
    throw new RouteError(
        HttpStatusCodes.UNAUTHORIZED,
        Errors.EmailNotFound(email),
    );
  }
  // Check password
  const hash = (user.pwdHash ?? ''),
      pwdPassed = await PwdUtil.compare(password, hash);
  if (!pwdPassed) {
    // If password failed, wait 500ms this will increase security
    await tick(500);
    throw new RouteError(
        HttpStatusCodes.UNAUTHORIZED,
        Errors.Unauth,
    );
  }
  // Return
  return user;
}

/**
 * Register a new user.
 */
async function register(email: string, password: string, name: string): Promise<IUser> {
  // Check if user already exists
  const existingUser = await UserRepo.getOne(email);
  if (existingUser) {
    throw new RouteError(
        HttpStatusCodes.CONFLICT,
        Errors.EmailInUse(email),
    );
  }

  const pwdHash = await PwdUtil.getHash(password);
  const newUser: IUser = {
    id: 0, // Assuming ID is auto-generated
    email,
    pwdHash,
    name,
    role: UserRoles.Standard, // Default role
    created: new Date(),
  };

  await UserRepo.add(newUser);

  return newUser;
}


// **** Export default **** //

export default {
  login,
  register,
} as const;