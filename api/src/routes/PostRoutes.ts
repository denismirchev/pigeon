import {IReq, IRes} from './types/express/misc';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import PostService from '@src/services/PostService';

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
  const posts = await PostService.getAllPosts();
  return res.status(HttpStatusCodes.OK).json({ posts });
}

export default {
  createPost,
  getAllPosts
} as const;

