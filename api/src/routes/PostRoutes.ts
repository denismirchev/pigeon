import { IReq, IRes } from './types/express/misc';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import PostService from '@src/services/PostService';
import UserService from '@src/services/UserService';
import EnvVars from '@src/common/EnvVars';
import ErrorsUtil from '@src/common/errors';

interface ICreatePostReq {
  userId: number;
  content: string;
  parentId?: number;
  repostId?: number;
}

class PostRoutes {
  public createPost = async (req: IReq<ICreatePostReq>, res: IRes) => {
    const content = req.body.content;
    const parentId = req.body.parentId ? Number(req.body.parentId) : undefined;
    const repostId = req.body.repostId ? Number(req.body.repostId) : undefined;

    const userId = res.locals.user?.id;

    if (!userId) {
      return res.status(ErrorsUtil.UnexpectedError.status)
        .json({ error: ErrorsUtil.UnexpectedError.message });
    }

    if (parentId && repostId) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        error: 'Post cannot be both a reply and a repost',
      });
    }

    // TODO add file formatting
    let attachments;
    const files = req.files as Express.Multer.File[];
    if (files && files.length > 0) {
      attachments = files.map((file) => file.filename).join(',');
    }

    let post;
    try {
      post = await PostService
        .createPost(userId, content, attachments, parentId, repostId);
    } catch (e) {
      const error = ErrorsUtil.getError(e);
      return res.status(error.status).json({ error: error.message });
    }

    return res.status(HttpStatusCodes.CREATED).json(post);
  };

  public getMainPosts = async (req: IReq, res: IRes) => {
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || EnvVars.Posts.DefaultLimit;
    const user = res.locals.user;

    const posts = PostService.getPosts(undefined, user?.id, offset, limit);
    return res.status(HttpStatusCodes.OK).json(await posts);
  };

  public getPost = async (req: IReq, res: IRes) => {
    const id = Number(req.params.id);
    const user = res.locals.user;

    const post = await PostService.getPost(id, user?.id);
    if (!post) {
      return res.status(HttpStatusCodes.NOT_FOUND).json({
        error: 'Post not found',
      });
    }

    return res.status(HttpStatusCodes.OK).json(post);
  };

  public getReplies = async (req: IReq, res: IRes) => {
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || EnvVars.Posts.DefaultLimit;
    const id = Number(req.params.id);
    const user = res.locals.user;

    const replies = await PostService.getPosts(id, user?.id, offset, limit);
    return res.status(HttpStatusCodes.OK).json(replies);
  };

  public getUserPosts = async (req: IReq, res: IRes) => {
    const username = req.params.username;
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || EnvVars.Posts.DefaultLimit;

    let posts;
    try {
      const user = await UserService.getUserByUsername(username);
      if (!user.id) {
        return res.status(ErrorsUtil.UserNotFound.status)
          .json({ error: ErrorsUtil.UserNotFound.message });
      }
      posts = await PostService.getUserPosts(user.id, offset, limit);
    } catch (e) {
      const error = ErrorsUtil.getError(e);
      return res.status(error.status).json({ error: error.message });
    }

    return res.status(HttpStatusCodes.OK).json(posts);
  };

  public deletePost = async (req: IReq, res: IRes) => {
    const postId = Number(req.params.id);

    const post = await PostService.getPost(postId);
    if (!post) {
      return res.status(HttpStatusCodes.NOT_FOUND).json({
        error: 'Post not found',
      });
    }

    await PostService.deletePost(postId);
    return res.status(HttpStatusCodes.OK).json({
      message: 'Post deleted successfully',
    });
  };

  public likePost = async (req: IReq, res: IRes) => {
    const user = res.locals.user;
    if (!user || !user.id) {
      return res.status(ErrorsUtil.UnexpectedError.status)
        .json({ error: ErrorsUtil.UnexpectedError.message });
    }

    try {
      await PostService.likePost(Number(req.params.id), user.id);
    } catch (e) {
      const error = ErrorsUtil.getError(e);
      return res.status(error.status).json({ error: error.message });
    }

    return res.status(HttpStatusCodes.OK).json({
      message: 'Post liked successfully',
    });
  };

  public unlikePost = async (req: IReq, res: IRes) => {
    const user = res.locals.user;
    if (!user || !user.id) {
      return;
    }

    try {
      const postId = Number(req.params.id);
      await PostService.unlikePost(postId, user.id);
    } catch (e) {
      const error = ErrorsUtil.getError(e);
      return res.status(error.status).json({ error: error.message });
    }

    return res.status(HttpStatusCodes.OK).json({
      message: 'Post unliked successfully',
    });
  };

  public getParents = async (req: IReq, res: IRes) => {
    const id = Number(req.params.id);

    const parents = await PostService.getPostParents(id);
    return res.status(HttpStatusCodes.OK).json(parents);
  };
}

export default new PostRoutes();
