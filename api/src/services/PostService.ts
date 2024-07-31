import {IPost} from '@src/db/models/Post';
import PostRepo from '@src/db/repos/PostRepo';

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

export default {
  createPost,
  getAllPosts,
};
