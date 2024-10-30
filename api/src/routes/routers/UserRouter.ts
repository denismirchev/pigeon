import { Router } from 'express';
import jetValidator from 'jet-validator';

import Paths from '@src/common/Paths';
import User from '@src/models/UserBac';
import UserRoutes from '@src/routes/UserRoutes';
import authenticateMw from '@src/routes/middleware/authenticateMw';
import multer from 'multer';
import path from 'path';
import { ROOT_DIR } from '@src/config';
import fs from 'fs';

const userRouter = Router();
const validate = jetValidator();

const storage = multer.diskStorage({
  destination: (req: Request, file: any, cb: any) => {
    const uploadPath = path.join(ROOT_DIR, 'public/uploads/pfps');
    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req: Request, file: any, cb: any) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Initialize multer with the storage options
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
  upload.single('profileImageUrl'),
  UserRoutes.update,
);

export default userRouter;
