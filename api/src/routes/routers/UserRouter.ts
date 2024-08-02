import { Router } from 'express';
import jetValidator from 'jet-validator';

import Paths from '@src/common/Paths';
import User from '@src/models/UserBac';
import UserRoutes from '@src/routes/UserRoutes';

const userRouter = Router();
const validate = jetValidator();

userRouter.get(
  Paths.Users.Get,
  UserRoutes.getAll,
);
userRouter.post(
  Paths.Users.Add,
  validate(['user', User.isUser]),
  UserRoutes.add,
);
userRouter.put(
  Paths.Users.Update,
  validate(['user', User.isUser]),
  UserRoutes.update,
);
userRouter.delete(
  Paths.Users.Delete,
  validate(['id', 'number', 'params']),
  UserRoutes.delete,
);

export default userRouter;
