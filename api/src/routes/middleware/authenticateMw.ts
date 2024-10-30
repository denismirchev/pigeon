import { NextFunction, Request, Response } from 'express';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '@src/config';
import UserService from '@src/services/UserService';
import { IUser } from '@src/db/models/User';

function authenticateMw(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(HttpStatusCodes.FORBIDDEN).json({
      error: 'Missing authorization token',
    });
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, async (err, user) => {
    const userId = (user as IUser).id;

    if (err || !user || !userId) {
      return res.status(HttpStatusCodes.FORBIDDEN).json({
        error: 'Unauthorized',
      });
    }

    res.locals.user = await UserService.getUserById(userId);
    next();
  });
}

export default authenticateMw;