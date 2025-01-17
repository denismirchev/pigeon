import UserRepo from '@src/db/repos/UserRepo';
import { IUser } from '@src/db/models/User';
import RouteError from '@src/common/RouteError';
import ErrorsUtil from '@src/common/errors';

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
    await UserRepo.updateUser(id, updates);
    return UserRepo.getUserById(id);
  }
}

export default new UserService();
