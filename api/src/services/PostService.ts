import {IPost, IPostJoins} from '@src/db/models/Post';
import {ILike} from '@src/db/models/Like';
import PostRepo from '@src/db/repos/PostRepo';
import LikeRepo from '@src/db/repos/LikeRepo';

class PostService {
  public async createPost(
    userId: number,
    content: string,
    attachments?: string,
    parentId?: number,
    repostId?: number,
  ): Promise<IPost | null> {
    if (parentId && repostId) {
      throw new Error('Post cannot be both a reply and a repost');
    }

    await PostRepo.create({ userId, content, attachments, parentId, repostId });
    const postData = await PostRepo.getLast();

    if (repostId) {
      await PostRepo.incRepostCount(repostId);
    } else if (parentId) {
      await PostRepo.incReplyCount(parentId);
    }

    return postData ? this.formatPostData(postData) : null;
  }

  public async getPosts(
    parentId?: number,
    offset?: number,
    limit?: number,
    excludedIds?: number[],
  ): Promise<IPost[]> {
    const postsData = await PostRepo
      .getPosts(parentId, offset, limit, excludedIds);

    return postsData.map((postData) => this.formatPostData(postData));
  }

  public async getPost(id: number): Promise<IPost | null> {
    const postData = await PostRepo.getPost(id);
    return postData ? this.formatPostData(postData) : null;
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

  private formatPostData(postData: IPostJoins): IPost {
    return {
      ...postData.posts,
      user: {
        id: postData.users.id,
        username: postData.users.username,
        nickname: postData.users.name,
        profileImageUrl: postData.users.profileImageUrl,
      },
      liked: !!postData.likes,
    };
  }
}

export default new PostService();
