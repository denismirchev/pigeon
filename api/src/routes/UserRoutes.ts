import HttpStatusCodes from '@src/common/HttpStatusCodes';

import UserService from '@src/services/UserServiceBac';
import { IUser } from '@src/models/UserBac';
import { IReq, IRes } from './types/express/misc';


// **** Functions **** //

/**
 * Get all users.
 */
async function getAll(_: IReq, res: IRes) {
  const users = await UserService.getAll();
  return res.status(HttpStatusCodes.OK).json({ users });
}

/**
 * Add one user.
 */
async function add(req: IReq<{ user: IUser }>, res: IRes) {
  const { user } = req.body;
  await UserService.addOne(user);
  return res.status(HttpStatusCodes.CREATED).end();
}

/**
 * Update one user.
 */
async function update(req: IReq<{user: IUser}>, res: IRes) {
  const { user } = req.body;
  await UserService.updateOne(user);
  return res.status(HttpStatusCodes.OK).end();
}

/**
 * Delete one user.
 */
async function delete_(req: IReq, res: IRes) {
  const id = +req.params.id;
  await UserService.delete(id);
  return res.status(HttpStatusCodes.OK).end();
}


function getByToken(req: IReq, res: IRes) {
  const user = res.locals.user;
  return res.status(HttpStatusCodes.OK).json({ ...user });
}

// **** Export default **** //

export default {
  getAll,
  add,
  update,
  delete: delete_,
  getByToken,
} as const;
