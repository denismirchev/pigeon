import UserRepo from '@src/db/repos/UserRepo';

async function getUserByUsername(username: string) {
  return UserRepo.getUserByUsername(username);
}

export default {
  getUserByUsername,
} as const;
