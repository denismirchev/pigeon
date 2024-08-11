import { Router } from 'express';
import jetValidator from 'jet-validator';

import Paths from '@src/common/Paths';
import PostRoutes from '@src/routes/PostRoutes';

const postRouter = Router();
const validate = jetValidator();

postRouter.post(
  Paths.Posts.Create,
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

export default postRouter;
