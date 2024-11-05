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

async function createPost(req: IReq<ICreatePostReq>, res: IRes) {
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
}

async function getMainPosts(req: IReq, res: IRes) {
  const offset = Number(req.query.offset) || 0;
  const limit = Number(req.query.limit) || DEFAULT_POSTS_LIMIT;

  const posts = await PostService.getPosts(undefined, offset, limit);
  return res.status(HttpStatusCodes.OK).json(posts);
}

async function getOnePost(req: IReq, res: IRes) {
  const id = Number(req.params.id);

  const post = await PostService.getPost(id);
  if (!post) {
    return res.status(HttpStatusCodes.NOT_FOUND).json({
      error: 'Post not found',
    });
  }

  return res.status(HttpStatusCodes.OK).json(post);
}

async function getReplies(req: IReq, res: IRes) {
  const offset = Number(req.query.offset);
  const limit = Number(req.query.limit);
  const id = Number(req.params.id);

  const replies = await PostService.getPosts(id, offset, limit);
  return res.status(HttpStatusCodes.OK).json(replies);
}

async function getUserPosts(req: IReq, res: IRes) {
  const username = req.params.username;
  const user = await UserService.getUserByUsername(username);
  if (!user || !user.id) {
    return res.status(HttpStatusCodes.NOT_FOUND).json({
      error: 'User not found',
    });
  }

  const posts = await PostService.getUserPosts(user.id);
  return res.status(HttpStatusCodes.OK).json(posts);
}

async function deletePost(req: IReq, res: IRes) {
  const user = res.locals.user;
  if (!user) {
    return res.status(HttpStatusCodes.UNAUTHORIZED).json({
      error: 'Unauthorized',
    });
  }

  const postId = Number(req.params.id);
  const post = await PostService.getPost(postId);
  if (!post) {
    return res.status(HttpStatusCodes.NOT_FOUND).json({
      error: 'Post not found',
    });
  }

  if (post.userId !== user.id) {
    return res.status(HttpStatusCodes.UNAUTHORIZED).json({
      error: 'Unauthorized',
    });
  }

  await PostService.deletePost(postId);
  return res.status(HttpStatusCodes.OK).json({
    message: 'Post deleted successfully',
  });
}

async function likePost(req: IReq, res: IRes) {
  const user = res.locals.user;
  if (!user) {
    return res.status(HttpStatusCodes.UNAUTHORIZED).json({
      error: 'Unauthorized',
    });
  }

  const postId = Number(req.params.id);
  // const post = await PostService.getOnePost(postId);
  // if (!post) {
  //   return res.status(HttpStatusCodes.NOT_FOUND).json({
  //    error: 'Post not found',
  //   });
  // }

  if (!user.id) {
    throw new Error('User not found');
  }

  await PostService.likePost(postId, user.id);
  return res.status(HttpStatusCodes.OK).json({
    message: 'Post liked successfully',
  });
}

async function unlikePost(req: IReq, res: IRes) {
  const user = res.locals.user;
  if (!user) {
    return res.status(HttpStatusCodes.UNAUTHORIZED).json({
      error: 'Unauthorized',
    });
  }

  const postId = Number(req.params.id);
  const post = await PostService.getPost(postId);
  if (!post) {
    return res.status(HttpStatusCodes.NOT_FOUND).json({
      error: 'Post not found',
    });
  }

  if (!user.id) {
    throw new Error('User not found');
  }

  await PostService.unlikePost(postId, user.id);
  return res.status(HttpStatusCodes.OK).json({
    message: 'Post unliked successfully',
  });
}

const getParents = async (req: IReq, res: IRes) => {
  const id = Number(req.params.id);
  const post = await PostService.getPost(id);
  if (!post) {
    return res.status(HttpStatusCodes.NOT_FOUND).json({
      error: 'Post not found',
    });
  }

  const parents = await PostService.getPostParents(id);

  const parentsWithUserData = await Promise.all(parents.map(async (parent) => {
    const user = await UserService.getUserById(parent.userId);
    // console.log(user);
    if (user) {
      return {
        ...parent,
        user: {
          id: user.id,
          username: user.username,
          profileImageUrl: user.profileImageUrl,
        },
      };
    }
    return null;
  }));

  // console.log(parentsWithUserData);

  return res.status(HttpStatusCodes.OK).json(parentsWithUserData);
};

export default {
  createPost,
  getAllPosts: getMainPosts,
  getOnePost,
  getUserPosts,
  deletePost,
  getReplies,
  likePost,
  unlikePost,
  getParents,
} as const;
