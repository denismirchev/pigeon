import {Request, Router} from 'express';
import jetValidator from 'jet-validator';

import Paths from '@src/common/Paths';
import PostRoutes from '@src/routes/PostRoutes';
import multer from "multer";
import path from "path";
import fs from "fs";

import { ROOT_DIR } from '@src/config';

const postRouter = Router();
const validate = jetValidator();



// Set up storage options for multer
const storage = multer.diskStorage({
  destination: (req: Request, file: any, cb: any) => {
    const uploadPath = path.join(ROOT_DIR, 'public/uploads');
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

// Initialize multer with the storage options
const upload = multer({ storage: storage });

postRouter.post(
  Paths.Posts.Create,
  upload.any(),
  validate('userId', 'content'),
  PostRoutes.createPost,
);

postRouter.get(
  Paths.Posts.GetAll,
  PostRoutes.getAllPosts,
);

postRouter.get(
  Paths.Posts.GetOne,
  validate(['id', 'number', 'params']),
  PostRoutes.getOnePost,
);

postRouter.get(
  Paths.Posts.GetOneParents,
  validate(['id', 'number', 'params']),
  PostRoutes.getParents,
);

postRouter.get(
  Paths.Posts.GetReplies,
  validate(['id', 'number', 'params']),
  PostRoutes.getReplies,
);

postRouter.get(
  Paths.Posts.GetByUsername,
  validate(['username', 'string', 'params']),
  PostRoutes.getUserPosts,
);

postRouter.delete(
  Paths.Posts.Delete,
  validate(['id', 'number', 'params']),
  PostRoutes.deletePost,
);

postRouter.post(
  Paths.Posts.Like,
  validate(['id', 'number', 'params']),
  PostRoutes.likePost,
);

postRouter.post(
  Paths.Posts.Unlike,
  validate(['id', 'number', 'params']),
  PostRoutes.unlikePost,
);

export default postRouter;
