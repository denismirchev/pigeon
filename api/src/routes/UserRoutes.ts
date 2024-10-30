import HttpStatusCodes from '@src/common/HttpStatusCodes';

import { IReq, IRes } from './types/express/misc';
import UserService from '@src/services/UserService';


// **** Functions **** //

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
