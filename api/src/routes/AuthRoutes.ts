import HttpStatusCodes from '@src/common/HttpStatusCodes';
import AuthService from '@src/services/AuthService';
import { IReq, IRes } from './types/express/misc';
import ErrorsUtil from '@src/common/errors';

interface ILoginReq {
  email: string;
  password: string;
}

interface IRegisterReq {
  nickname: string;
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
    const { email, password, nickname, username } = req.body;
    try {
      await AuthService.register(email, password, nickname, username);
    } catch (e) {
      const error = ErrorsUtil.getError(e);
      return res.status(error.status).json({ error: error.message });
    }

    return res.status(HttpStatusCodes.CREATED).json({
      message: 'User registered successfully',
    });
  };

  public logout = async (req: IReq<ILogoutReq>, res: IRes) => {
    const { token } = req.body;
    try {
      await AuthService.logout(token);
    } catch (e) {
      const error = ErrorsUtil.getError(e);
      return res.status(error.status).json({ error: error.message });
    }

    return res.status(HttpStatusCodes.OK).json({
      message: 'User logged out successfully',
    });
  };

  public refreshAccessToken = async (
    req: IReq<IRefreshTokenReq>,
    res: IRes,
  ) => {
    const { token } = req.body;

    let accessToken;
    try {
      accessToken = await AuthService.refreshAccessToken(token);
    } catch (e) {
      const error = ErrorsUtil.getError(e);
      return res.status(error.status).json({ error: error.message });
    }

    return res.status(HttpStatusCodes.OK).json({
      accessToken,
    });
  };
}

export default new AuthRoutes();
