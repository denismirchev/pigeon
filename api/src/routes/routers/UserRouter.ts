import { Router } from 'express';
import jetValidator from 'jet-validator';
import Paths from '@src/common/Paths';
import UserRoutes from '@src/routes/UserRoutes';
import authenticateMw from '@src/routes/middleware/authenticateMw';
import multer from 'multer';
import { createStorage } from '@src/routes/routers/utils';

const userRouter = Router();
const validate = jetValidator();
const uploadPfps = multer({
  storage: createStorage('public/uploads/pfps'),
});

userRouter.get(
  Paths.Users.GetByToken,
  authenticateMw,
  UserRoutes.getByToken,
);

userRouter.get(
  Paths.Users.GetByUsername,
  validate(['username', 'string', 'params']),
  UserRoutes.getByUsername,
);

userRouter.patch(
  Paths.Users.Update,
  authenticateMw,
  uploadPfps.single('profileImageUrl'),
  UserRoutes.update,
);

export default userRouter;
