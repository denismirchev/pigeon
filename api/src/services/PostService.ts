import { IPost } from '@src/db/models/Post';
import PostRepo from '@src/db/repos/PostRepo';
import {ILike} from '@src/db/models/Like';
import LikeRepo from '@src/db/repos/LikeRepo';

// eslint-disable-next-line max-len
async function createPost(userId: number, content: string, attachments?: string, parentId?: number): Promise<IPost> {
  const newPost: IPost = {
    userId,
    content,
    attachments,
    parentId,
  };

  await PostRepo.create(newPost);
  return PostRepo.getLast();
}

async function getAllPosts(): Promise<IPost[]> {
  return PostRepo.getAll();
}

async function getOnePost(id: number): Promise<IPost | null> {
  return PostRepo.getOne(id);
}

async function getPostReplies(id: number): Promise<IPost[]> {
  return PostRepo.getPostReplies(id);
}

async function getPostsByUserId(userId: number): Promise<IPost[]> {
  return PostRepo.getByUserId(userId);
}

async function deletePostById(id: number): Promise<void> {
  const post = await PostRepo.getOne(id);
  if (!post) {
    throw new Error('Post not found');
  }
  await PostRepo.deleteById(id);
}

async function likePost(postId: number, userId: number): Promise<void> {
  const newLike: ILike = {
    postId,
    userId,
  };
  try {
    await LikeRepo.create(newLike);
  } catch (e) {
    // TODO: handle errors
    throw new Error('Failed to like post');
  }
  await PostRepo.incLikeCount(postId);
}

async function unlikePost(postId: number, userId: number): Promise<void> {
  if (!(await LikeRepo.get(postId, userId))) {
    throw new Error('Like not found');
  }

  await LikeRepo.delete(postId, userId);
  await PostRepo.decLikeCount(postId);
}

async function isPostLikedByUser(postId: number, userId: number)
  : Promise<boolean> {

  return !!await LikeRepo.get(postId, userId);
}

export default {
  createPost,
  getAllPosts,
  getOnePost,
  getPostsByUserId,
  deletePostById,
  getPostReplies,
  likePost,
  unlikePost,
  isPostLikedByUser,
} as const;
