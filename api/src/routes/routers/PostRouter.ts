import { Router } from 'express';
import jetValidator from 'jet-validator';

import Paths from '@src/common/Paths';
import PostRoutes from '@src/routes/PostRoutes';
import multer from 'multer';
import { createStorage } from '@src/routes/routers/utils';

const postRouter = Router();
const validate = jetValidator();
const uploadAttachments = multer({
  storage: createStorage('public/uploads/attachments'),
});


postRouter.post(
  Paths.Posts.Create,
  uploadAttachments.any(),
  validate('userId', 'content'),
  PostRoutes.createPost,
);

postRouter.get(
  Paths.Posts.GetAll,
  PostRoutes.getMainPosts,
);

postRouter.get(
  Paths.Posts.GetOne,
  validate(['id', 'number', 'params']),
  PostRoutes.getPost,
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
