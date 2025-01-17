import UserRepo from '@src/db/repos/UserRepo';
import { IUser } from '@src/db/models/User';
import RouteError from '@src/common/RouteError';
import ErrorsUtil from '@src/common/errors';
import {
  extractEntryFromSqlMessage,
  extractFieldFromSqlMessage,
  isDatabaseError,
} from '@src/db/utils';

class UserService {
  public async getUserById(id: number) {
    return UserRepo.getUserById(id);
  }

  public async getUserByUsername(username: string) {
    const user = await UserRepo.getUserByUsername(username);
    if (!user) {
      throw new RouteError(
        ErrorsUtil.UserNotFound.status,
        ErrorsUtil.UserNotFound.message,
      );
    }

    return user;
  }

  public async updateUser(id: number, updates: Partial<IUser>) {
    try {
      await UserRepo.updateUser(id, updates);
    } catch (err) {
      if (isDatabaseError(err) && err.code === 'ER_DUP_ENTRY') {
        const field = extractFieldFromSqlMessage(err.sqlMessage);
        const entry = extractEntryFromSqlMessage(err.sqlMessage);

        const error = ErrorsUtil.FieldAlreadyExists(field, entry);
        throw new RouteError(
          error.status,
          error.message,
        );
      }

      throw new RouteError(
        ErrorsUtil.UnexpectedError.status,
        ErrorsUtil.UnexpectedError.message,
      );
    }
    return UserRepo.getUserById(id);
  }
}

export default new UserService();
