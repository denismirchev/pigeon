import HttpStatusCodes from '@src/common/HttpStatusCodes';
import SessionUtil from '@src/util/SessionUtil';
import AuthService from '@src/services/AuthService';

import { IReq, IRes } from './types/express/misc';


// **** Types **** //

interface ILoginReq {
  email: string;
  password: string;
}

interface IRegisterReq {
  email: string;
  password: string;
  name: string;
}

// **** Functions **** //

/**
 * Login a user.
 */
async function login(req: IReq<ILoginReq>, res: IRes) {
  const { email, password } = req.body;
  // Login
  const user = await AuthService.login(email, password);

  // Setup Admin Cookie
  await SessionUtil.addSessionData(res, {
    id: user.id,
    email: user.name,
    name: user.name,
    role: user.role,
  });

  return res.status(HttpStatusCodes.OK).end();
}

/**
 * Register a new user.
 */
async function register(req: IReq<IRegisterReq>, res: IRes) {
    const { email, password, name } = req.body;
    // Register
    const user = await AuthService.register(email, password, name);

    // Setup Admin Cookie
    await SessionUtil.addSessionData(res, {
        id: user.id,
        email: user.name,
        name: user.name,
        role: user.role,
    });

    return res.status(HttpStatusCodes.OK).end();
}

/**
 * Logout the user.
 */
function logout(_: IReq, res: IRes) {
  SessionUtil.clearCookie(res);
  return res.status(HttpStatusCodes.OK).end();
}

// **** Export default **** //

export default {
  login,
  logout,
  register,
} as const;
