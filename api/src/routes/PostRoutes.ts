import { IReq, IRes } from './types/express/misc';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import PostService from '@src/services/PostService';
import UserService from '@src/services/UserService';
import {IPost} from '@src/db/models/Post';
import {IUser} from '@src/db/models/User';

interface ICreatePostReq {
  userId: number;
  content: string;
  attachments?: string;
}

interface IUpdatePostReq {
  id: number;
  userId: number;
  content: string;
  attachments?: string;
}

async function createPost(req: IReq<ICreatePostReq>, res: IRes) {
  const { userId, content, attachments } = req.body;
  const post = await PostService.createPost(userId, content, attachments);
  if (!post) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({
      error: 'Failed to create post',
    });
  }

  return res.status(HttpStatusCodes.OK).json({
    message: 'Post created successfully',
  });
}

async function getAllPosts(_: IReq, res: IRes) {
  const posts: IPost[] = await PostService.getAllPosts();
  return res.status(HttpStatusCodes.OK).json({ posts });
}

async function getOnePost(req: IReq, res: IRes) {
  const id = Number(req.params.id);
  const post = await PostService.getOnePost(id);
  if (!post) {
    return res.status(HttpStatusCodes.NOT_FOUND).json({
      error: 'Post not found',
    });
  }
  return res.status(HttpStatusCodes.OK).json(post);
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


export default {
  createPost,
  getAllPosts,
  getOnePost,
  getUserPosts,
  deletePost,
} as const;

