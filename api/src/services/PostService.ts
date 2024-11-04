import { IPost } from '@src/db/models/Post';
import { ILike } from '@src/db/models/Like';
import PostRepo from '@src/db/repos/PostRepo';
import LikeRepo from '@src/db/repos/LikeRepo';
import UserService from '@src/services/UserService';

class PostService {
  public async createPost(
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

    const post = await PostRepo.getLast();
    if (!post) {
      throw new Error('Failed to create post');
    }

    // Add user info to post
    const user = await UserService.getUserById(post.userId);
    if (!user || !user.id) {
      throw new Error('User not found');
    }

    post.user = {
      id: user.id,
      username: user.username,
      nickname: user.name,
      profileImageUrl: user.profileImageUrl,
    };

    if (repostId) {
      await PostRepo.incRepostCount(repostId);
    } else if (parentId) {
      await PostRepo.incReplyCount(parentId);
    }

    return post;
  }

  public async getPosts(
    parentId?: number,
    offset?: number,
    limit?: number,
    excludedIds?: number[],
  ): Promise<IPost[]> {
    return PostRepo.getPosts(parentId, offset, limit, excludedIds);
  }

  public async getPost(id: number): Promise<IPost | null> {
    return PostRepo.getPost(id);
  }

  public async getUserPosts(userId: number): Promise<IPost[]> {
    return PostRepo.getPostByUserId(userId);
  }

  public async deletePost(id: number): Promise<void> {
    const post = await PostRepo.getPost(id);
    if (!post) {
      throw new Error('Post not found');
    }
    await PostRepo.deletePostById(id);
  }

  public async likePost(postId: number, userId: number): Promise<void> {
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

  public async unlikePost(postId: number, userId: number): Promise<void> {
    if (!(await LikeRepo.get(postId, userId))) {
      throw new Error('Like not found');
    }

    await LikeRepo.delete(postId, userId);
    await PostRepo.decLikeCount(postId);
  }

  public async isPostLikedByUser(postId: number, userId: number)
    : Promise<boolean> {
    return !!await LikeRepo.get(postId, userId);
  }

  public async getPostParents(id: number): Promise<IPost[]> {
    return PostRepo.getPostParents(id);
  }
}

export default new PostService();
