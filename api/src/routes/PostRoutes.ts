import { IReq, IRes } from './types/express/misc';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import PostService from '@src/services/PostService';
import UserService from '@src/services/UserService';
import { DEFAULT_POSTS_LIMIT } from '@src/config';

interface ICreatePostReq {
  userId: number;
  content: string;
  parentId?: number;
  repostId?: number;
}

class PostRoutes {
  public createPost = async (req: IReq<ICreatePostReq>, res: IRes) => {
    const { userId, content, parentId, repostId } = req.body;

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

    const post = await PostService
      .createPost(userId, content, attachments, parentId, repostId);

    if (!post) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        error: 'Failed to create post',
      });
    }

    return res.status(HttpStatusCodes.OK).json(post);
  };

  public getMainPosts = async (req: IReq, res: IRes) => {
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || DEFAULT_POSTS_LIMIT;

    const posts = await PostService.getPosts(undefined, offset, limit);
    return res.status(HttpStatusCodes.OK).json(posts);
  };

  public getPost = async (req: IReq, res: IRes) => {
    const id = Number(req.params.id);

    const post = await PostService.getPost(id);
    if (!post) {
      return res.status(HttpStatusCodes.NOT_FOUND).json({
        error: 'Post not found',
      });
    }

    return res.status(HttpStatusCodes.OK).json(post);
  };

  public getReplies = async (req: IReq, res: IRes) => {
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || DEFAULT_POSTS_LIMIT;
    const id = Number(req.params.id);

    const replies = await PostService.getPosts(id, offset, limit);
    return res.status(HttpStatusCodes.OK).json(replies);
  };

  public getUserPosts = async (req: IReq, res: IRes) => {
    const username = req.params.username;
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || DEFAULT_POSTS_LIMIT;

    const user = await UserService.getUserByUsername(username);
    if (!user || !user.id) {
      return res.status(HttpStatusCodes.NOT_FOUND).json({
        error: 'User not found',
      });
    }

    const posts = await PostService.getUserPosts(user.id, offset, limit);
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
      throw new Error('User not found');
    }

    const postId = Number(req.params.id);
    await PostService.likePost(postId, user.id);

    return res.status(HttpStatusCodes.OK).json({
      message: 'Post liked successfully',
    });
  };

  public unlikePost = async (req: IReq, res: IRes) => {
    const user = res.locals.user;
    if (!user || !user.id) {
      return;
    }

    const postId = Number(req.params.id);
    await PostService.unlikePost(postId, user.id);

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
