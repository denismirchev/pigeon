import UserRepo from '@src/db/repos/UserRepo';

async function getUserByUsername(username: string) {
  return UserRepo.getUserByUsername(username);
}

async function getUserById(id: number) {
  return UserRepo.getUserById(id);
}

async function getUsersByIds(ids: number[]) {
  return UserRepo.getUsersByIds(ids);
}

export default {
  getUserByUsername,
  getUserById,
  getUsersByIds,
} as const;
