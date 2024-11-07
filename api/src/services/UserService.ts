import UserRepo from '@src/db/repos/UserRepo';
import { IUser } from '@src/db/models/User';

class UserService {
  public async getUserById(id: number) {
    return UserRepo.getUserById(id);
  }

  public async getUserByUsername(username: string) {
    return UserRepo.getUserByUsername(username);
  }

  public async updateUser(id: number, updates: Partial<IUser>) {
    await UserRepo.updateUser(id, updates);
    return UserRepo.getUserById(id);
  }
}

export default new UserService();
