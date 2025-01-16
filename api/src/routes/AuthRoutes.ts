import HttpStatusCodes from '@src/common/HttpStatusCodes';
import AuthService from '@src/services/AuthService';
import { IReq, IRes } from './types/express/misc';
import ErrorsUtil from '@src/common/errors';

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

// **** Class **** //

class AuthRoutes {
  public login = async (req: IReq<ILoginReq>, res: IRes) => {
    const { email, password } = req.body;
    try {
      const user = await AuthService.login(email, password);
      const tokens = await AuthService.createTokens(user);

      return res.status(HttpStatusCodes.OK).json(tokens);
    } catch (e) {
      const error = ErrorsUtil.getError(e);
      return res.status(error.status).json({ error: error.message });
    }
  };

  public register = async (req: IReq<IRegisterReq>, res: IRes) => {
    const { email, password, name, username } = req.body;
    const user = await AuthService.register(email, password, name, username);
    if (!user) {
      return res.status(HttpStatusCodes.BAD_REQUEST).end();
    }

    return res.status(HttpStatusCodes.OK).json({
      message: 'User registered successfully',
    });
  };

  public logout = async (req: IReq<ILogoutReq>, res: IRes) => {
    const { token } = req.body;
    await AuthService.logout(token);
    return res.status(HttpStatusCodes.OK).json({
      message: 'Logged out successfully',
    });
  };

  public refreshAccessToken = async (
    req: IReq<IRefreshTokenReq>,
    res: IRes,
  ) => {
    const { token } = req.body;
    const accessToken = await AuthService.refreshAccessToken(token);
    return res.status(HttpStatusCodes.OK).json({
      accessToken: accessToken,
    });
  };
}

// **** Export default **** //

export default new AuthRoutes();