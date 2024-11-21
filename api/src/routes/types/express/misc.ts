import * as e from 'express';
import { IUser } from '@src/db/models/User';

export interface IReq<T = void> extends e.Request {
  body: T;
}

export interface IRes extends e.Response {
  locals: {
    user?: IUser;
  };
}
