import UserRepo from '@src/db/repos/UserRepo';
import {IUser} from '@src/db/models/User';

async function getUserByUsername(username: string) {
  return UserRepo.getUserByUsername(username);
}

async function getUserById(id: number) {
  return UserRepo.getUserById(id);
}

async function getUsersByIds(ids: number[]) {
  return UserRepo.getUsersByIds(ids);
}

async function updateUser(id: number, updates: Partial<IUser>) {
  await UserRepo.updateUser(id, updates);
  return UserRepo.getUserById(id);
}

export default {
  getUserByUsername,
  getUserById,
  getUsersByIds,
  updateUser,
} as const;
