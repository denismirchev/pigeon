import HttpStatusCodes from '@src/common/HttpStatusCodes';
import { IReq, IRes } from './types/express/misc';
import UserService from '@src/services/UserService';
import ErrorsUtil from '@src/common/errors';

interface IUpdatePostReq {
  username?: string;
  nickname?: string;
  bio?: string;
  profileImageUrl?: string;
  location?: string;
  website?: string;
  email?: string;
}

class UserRoutes {
  public update = async (req: IReq<IUpdatePostReq>, res: IRes) => {
    const updates = {
      ...req.body,
      profileImageUrl: req.file?.filename,
      name: req.body.nickname,
    };

    const user = res.locals.user;
    if (!user || !user.id) {
      return res.status(ErrorsUtil.UnexpectedError.status)
        .json(ErrorsUtil.UnexpectedError.message);
    }

    let updatedUser;
    try {
      updatedUser = await UserService.updateUser(user.id, updates);
    } catch (e) {
      const error = ErrorsUtil.getError(e);
      return res.status(error.status).json({ error: error.message });
    }

    return res.status(HttpStatusCodes.OK).json(updatedUser);
  };

  public getByToken = (req: IReq, res: IRes) => {
    const user = res.locals.user;
    if (!user) {
      return res.status(ErrorsUtil.UserNotFound.status)
        .json(ErrorsUtil.UserNotFound.message);
    }

    return res.status(HttpStatusCodes.OK).json({ ...user });
  };

  public getByUsername = async (req: IReq, res: IRes) => {
    let user;
    try {
      user = await UserService.getUserByUsername(req.params.username);
    } catch (e) {
      const error = ErrorsUtil.getError(e);
      return res.status(error.status).json({ error: error.message });
    }

    return res.status(HttpStatusCodes.OK).json({ ...user });
  };
}

export default new UserRoutes();
