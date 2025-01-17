import UserService from '@src/services/UserService';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import jwt from 'jsonwebtoken';
import { IUser } from '@src/db/models/User';
import EnvVars from '@src/common/EnvVars';
import { NextFunction, Request, Response } from 'express';
import ErrorsUtil from '@src/common/errors';

function authenticateMw(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(ErrorsUtil.Unauthorized.status).json({
      error: ErrorsUtil.Unauthorized.message,
    });
  }

  jwt.verify(token, EnvVars.Jwt.AccessSecret, async (err, decoded) => {
    if (err || !decoded) {
      return res.status(ErrorsUtil.Unauthorized.status).json({
        error: ErrorsUtil.Unauthorized.message,
      });
    }

    const userId = (decoded as IUser).id;
    if (!userId) {
      return res.status(ErrorsUtil.Unauthorized.status).json({
        error: ErrorsUtil.Unauthorized.message,
      });
    }

    const user = await UserService.getUserById(userId);
    if (!user) {
      return res.status(ErrorsUtil.Unauthorized.status).json({
        error: ErrorsUtil.Unauthorized.message,
      });
    }
    res.locals.user = user;
    next();
  });
}

export default authenticateMw;
