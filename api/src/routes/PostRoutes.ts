import { IReq, IRes } from './types/express/misc';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import PostService from '@src/services/PostService';
import UserService from '@src/services/UserService';
import { IPost } from '@src/db/models/Post';

interface ICreatePostReq {
  userId: number;
  content: string;
  attachments?: string;
  parentId?: number;
}

interface IUpdatePostReq {
  id: number;
  userId: number;
  content: string;
  attachments?: string;
}

async function createPost(req: IReq<ICreatePostReq>, res: IRes) {
  const { userId, content, parentId } = req.body;

  // TODO add file formatting
  let attachments;
  const files = req.files as Express.Multer.File[];
  if (files && files.length > 0) {
    attachments = files.map((file) => file.filename).join(',');
  }

  const post = await PostService
    .createPost(userId, content, attachments, parentId);
  if (!post) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({
      error: 'Failed to create post',
    });
  }

  const user = await UserService.getUserById(post.userId);
  if (!user) {
    return res.status(HttpStatusCodes.NOT_FOUND).json({
      error: 'User not found',
    });
  }

  const response = {
    ...post,
    user: {
      id: user.id,
      username: user.username,
      profileImageUrl: user.profileImageUrl,
    },
  };

  return res.status(HttpStatusCodes.OK).json(response);
}

async function getAllPosts(_: IReq, res: IRes) {
  const posts: IPost[] = await PostService.getAllPosts();

  const userIds = posts.map((post) => post.userId);
  const users = await UserService.getUsersByIds(userIds);

  if (!res.locals.user?.id) {
    throw new Error('User not found');
  }

  const userId = res.locals.user.id;

  const postsWithUserData = await Promise.all(posts.map(async (post) => {
    const user = users.find((u) => u.id === post.userId);
    if (user) {
      if (!post.id) {
        throw new Error('Post not found');
      }
      const liked = await PostService.isPostLikedByUser(post.id, userId);
      return {
        ...post,
        user: {
          id: user.id,
          username: user.username,
          profileImageUrl: user.profileImageUrl,
        },
        liked,
      };
    }
    return null;
  }));

  return res.status(HttpStatusCodes.OK).json(postsWithUserData);
}

async function getOnePost(req: IReq, res: IRes) {
  const id = Number(req.params.id);
  const post = await PostService.getOnePost(id);
  if (!post) {
    return res.status(HttpStatusCodes.NOT_FOUND).json({
      error: 'Post not found',
    });
  }

  const user = await UserService.getUserById(post.userId);
  if (!user) {
    return res.status(HttpStatusCodes.NOT_FOUND).json({
      error: 'User not found',
    });
  }

  if (!res.locals.user?.id) {
    throw new Error('User not found');
  }
  const liked = await PostService.isPostLikedByUser(id, res.locals.user?.id);

  const { userId, ...postWithoutUserId } = post;
  const response = {
    ...postWithoutUserId,
    user: {
      id: user.id,
      username: user.username,
      profileImageUrl: user.profileImageUrl,
    },
    liked,
  };

  return res.status(HttpStatusCodes.OK).json(response);
}

async function getReplies(req: IReq, res: IRes) {
  const id = Number(req.params.id);
  const replies = await PostService.getPostReplies(id);

  const userIds = replies.map((reply) => reply.userId);
  const users = await UserService.getUsersByIds(userIds);

  // add liked field to each reply
  if (!res.locals.user?.id) {
    throw new Error('User not found');
  }

  const userId = res.locals.user.id;

  const repliesWithUserData = await Promise.all(replies.map(async (reply) => {
    const user = users.find((u) => u.id === reply.userId);
    if (!reply.id) {
      throw new Error('Reply not found');
    }
    const liked = await PostService.isPostLikedByUser(reply.id, userId);
    if (user) {
      return {
        ...reply,
        user: {
          id: user.id,
          username: user.username,
          profileImageUrl: user.profileImageUrl,
        },
        liked,
      };
    }
    return null;
  }));

  return res.status(HttpStatusCodes.OK).json(repliesWithUserData);
}

async function getUserPosts(req: IReq, res: IRes) {
  const username = req.params.username;
  const user = await UserService.getUserByUsername(username);
  if (!user || !user.id) {
    return res.status(HttpStatusCodes.NOT_FOUND).json({
      error: 'User not found',
    });
  }

  const posts = await PostService.getPostsByUserId(user.id);
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
  const post = await PostService.getOnePost(postId);
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

  await PostService.deletePostById(postId);
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
  const post = await PostService.getOnePost(postId);
  if (!post) {
    return res.status(HttpStatusCodes.NOT_FOUND).json({
      error: 'Post not found',
    });
  }

  await PostService.unlikePost(postId, user.id);
  return res.status(HttpStatusCodes.OK).json({
    message: 'Post unliked successfully',
  });
}


export default {
  createPost,
  getAllPosts,
  getOnePost,
  getUserPosts,
  deletePost,
  getReplies,
  likePost,
  unlikePost,
} as const;

