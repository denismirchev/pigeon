import * as e from 'express';

import { ISessionUser } from '@src/models/UserBac';
import { IUser } from '@src/db/models/User';


// **** Express **** //

export interface IReq<T = void> extends e.Request {
  body: T;
}

export interface IRes extends e.Response {
  locals: {
    user?: IUser;
  };
}
