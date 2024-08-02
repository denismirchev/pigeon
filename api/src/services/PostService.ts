import { IPost } from '@src/db/models/Post';
import PostRepo from '@src/db/repos/PostRepo';

// eslint-disable-next-line max-len
async function createPost(userId: number, content: string, attachments?: string): Promise<IPost> {
  const newPost: IPost = {
    userId,
    content,
    attachments,
  };

  await PostRepo.create(newPost);

  return newPost;
}

async function getAllPosts(): Promise<IPost[]> {
  return PostRepo.getAll();
}

async function getOnePost(id: number): Promise<IPost | null> {
  return PostRepo.getOne(id);
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

export default {
  createPost,
  getAllPosts,
  getOnePost,
  getPostsByUserId,
  deletePostById,
} as const;
