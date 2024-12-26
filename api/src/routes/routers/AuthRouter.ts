import { Router } from 'express';
import jetValidator from 'jet-validator';

import Paths from '@src/common/Paths';
import AuthRoutes from '@src/routes/AuthRoutes';

const authRouter = Router();
const validate = jetValidator();

authRouter.post(
  Paths.Auth.Login,
  validate('email', 'password'),
  AuthRoutes.login,
);
authRouter.post(
  Paths.Auth.Register,
  validate('name', 'username', 'email', 'password'),
  AuthRoutes.register,
);
authRouter.post(
  Paths.Auth.Logout,
  validate('token'),
  AuthRoutes.logout,
);
authRouter.post(
  Paths.Auth.Refresh,
  validate('token'),
  AuthRoutes.refreshAccessToken,
);

export default authRouter;
