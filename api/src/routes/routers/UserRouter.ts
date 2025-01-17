import { Router } from 'express';
import jetValidator from 'jet-validator';
import Paths from '@src/common/Paths';
import UserRoutes from '@src/routes/UserRoutes';
import authenticateMw from '@src/routes/middleware/authenticateMw';
import multer from 'multer';
import { createStorage } from '@src/routes/routers/utils';
import RouteError from '@src/common/RouteError';
import HttpStatusCodes from '@src/common/HttpStatusCodes';

const userRouter = Router();
const validate = jetValidator();
const uploadPfps = multer({
  storage: createStorage('public/uploads/pfps'),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new RouteError(
        HttpStatusCodes.UNSUPPORTED_MEDIA_TYPE,
        'Unsupported Media Type - Only JPEG and PNG are allowed',
      ));
    }
  },
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
