import { IPost } from '@src/db/models/Post';
import { ILike } from '@src/db/models/Like';
import PostRepo from '@src/db/repos/PostRepo';
import LikeRepo from '@src/db/repos/LikeRepo';

async function createPost(
  userId: number,
  content: string,
  attachments?: string,
  parentId?: number,
  repostId?: number,
): Promise<IPost> {
  if (parentId && repostId) {
    throw new Error('Post cannot be both a reply and a repost');
  }

  await PostRepo.create({ userId, content, attachments, parentId, repostId });
  if (repostId) {
    await PostRepo.incRepostCount(repostId);
  } else if (parentId) {
    await PostRepo.incReplyCount(parentId);
  }

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

async function getOneParents(id: number): Promise<IPost[]> {
  const post = await PostRepo.getOne(id);
  if (!post) {
    throw new Error('Post not found');
  }
  return PostRepo.getOneParents(id);
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
  getOneParents,
} as const;
