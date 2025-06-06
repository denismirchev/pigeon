import { Router } from 'express';
import jetValidator from 'jet-validator';

import Paths from '@src/common/Paths';
import PostRoutes from '@src/routes/PostRoutes';
import multer from 'multer';
import { createStorage } from '@src/routes/routers/utils';
import RouteError from '@src/common/RouteError';
import HttpStatusCodes from '@src/common/HttpStatusCodes';

const postRouter = Router();
const validate = jetValidator();
const uploadAttachments = multer({
  storage: createStorage('public/uploads/attachments'),
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'video/mp4',
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new RouteError(
        HttpStatusCodes.UNSUPPORTED_MEDIA_TYPE,
        'Unsupported Media Type - Only JPEG, JPG, PNG and MP4 are allowed.',
      ));
    }
  },
});


postRouter.post(
  Paths.Posts.Create,
  uploadAttachments.any(),
  validate('content'),
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
