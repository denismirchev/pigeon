import {NextFunction, Request, Response} from 'express';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import jwt from 'jsonwebtoken';
import {ACCESS_TOKEN_SECRET} from '@src/config';

function authenticateMw(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(HttpStatusCodes.FORBIDDEN).json({
      error: 'Missing authorization token',
    });
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(HttpStatusCodes.FORBIDDEN).json({
        error: 'Unauthorized',
      });
    }
    res.locals.user = user;
    next();
  });
}

export default authenticateMw;
