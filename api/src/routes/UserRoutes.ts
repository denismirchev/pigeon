import HttpStatusCodes from '@src/common/HttpStatusCodes';

import { IReq, IRes } from './types/express/misc';
import UserService from '@src/services/UserService';

interface IUpdatePostReq {
  username?: string;
  nickname?: string;
  bio?: string;
  profileImageUrl?: string;
  location?: string;
  website?: string;
  email?: string;
}

async function update(req: IReq<IUpdatePostReq>, res: IRes) {
  const profileImageUrl = req.file?.filename;

  const username = req.body.username;
  const nickname = req.body.nickname;
  const bio = req.body.bio;
  const location = req.body.location;
  const website = req.body.website;
  const email = req.body.email;

  const updates = {
    profileImageUrl,
    username,
    name: nickname,
    bio,
    location,
    website,
    email,
  };

  const user = res.locals.user;
  if (!user || !user.id) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json('User not found');
  }

  const updatedUser = await UserService.updateUser(user.id, updates);

  return res.status(HttpStatusCodes.OK).json(updatedUser);
}


function getByToken(req: IReq, res: IRes) {
  const user = res.locals.user;
  return res.status(HttpStatusCodes.OK).json({ ...user });
}

async function getByUsername(req: IReq, res: IRes) {
  const username = req.params.username;
  const user = await UserService.getUserByUsername(username);
  return res.status(HttpStatusCodes.OK).json({ ...user });
}

// **** Export default **** //

export default {
  getAll: () => {},
  add: () => {},
  update: () => {},
  delete: () => {},
  getByToken,
  getByUsername,
} as const;
