import HttpStatusCodes from '@src/common/HttpStatusCodes';
import AuthService from '@src/services/AuthService';
import { IReq, IRes } from './types/express/misc';

// **** Types **** //

interface ILoginReq {
  email: string;
  password: string;
}

interface IRegisterReq {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface IRefreshTokenReq {
  token: string;
}

interface ILogoutReq {
  token: string;
}

// **** Functions **** //

/**
 * Login a user.
 */
async function login(req: IReq<ILoginReq>, res: IRes) {
  const { email, password } = req.body;
  const user = await AuthService.login(email, password);
  const { accessToken, refreshToken } = await AuthService.createTokens(user);

  return res.status(HttpStatusCodes.OK).json({
    accessToken,
    refreshToken,
  });
}

/**
 * Register a new user.
 */
async function register(req: IReq<IRegisterReq>, res: IRes) {
  const { email, password, name, username } = req.body;
  const user = await AuthService.register(email, password, name, username);
  if (!user) {
    return res.status(HttpStatusCodes.BAD_REQUEST).end();
  }

  return res.status(HttpStatusCodes.OK).json({
    message: 'User registered successfully',
  });
}

/**
 * Logout the user.
 */
async function logout(req: IReq<ILogoutReq>, res: IRes) {
  const { token } = req.body;
  await AuthService.logout(token);
  return res.status(HttpStatusCodes.OK).json({
    message: 'Logged out successfully',
  });
}

async function refreshAccessToken(req: IReq<IRefreshTokenReq>, res: IRes) {
  const { token } = req.body;
  const accessToken = await AuthService.refreshAccessToken(token);
  return res.status(HttpStatusCodes.OK).json({
    accessToken: accessToken,
  });
}

// **** Export default **** //

export default {
  login,
  logout,
  register,
  refreshAccessToken,
} as const;
