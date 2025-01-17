import {IPost, IPostJoins} from '@src/db/models/Post';
import {ILike} from '@src/db/models/Like';
import PostRepo from '@src/db/repos/PostRepo';
import LikeRepo from '@src/db/repos/LikeRepo';
import RouteError from '@src/common/RouteError';
import ErrorsUtil from '@src/common/errors';
import HttpStatusCodes from '@src/common/HttpStatusCodes';

class PostService {
  public createPost = async (
    userId: number,
    content: string,
    attachments?: string,
    parentId?: number,
    repostId?: number,
  ): Promise<IPost | null> => {
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

    if (!postData) {
      throw new RouteError(
        ErrorsUtil.UnexpectedError.status,
        ErrorsUtil.UnexpectedError.message,
      );
    }

    return this.formatPostData(postData);
  };

  public getPosts = async (
    parentId?: number,
    currentUserId?: number,
    offset?: number,
    limit?: number,
    excludedIds?: number[],
  ): Promise<IPost[]> => {
    const postsData = await PostRepo
      .getPosts(parentId, currentUserId, offset, limit, excludedIds);

    return postsData.map((postData) => this.formatPostData(postData));
  };

  public getPost = async (id: number, currentUserId?: number)
  : Promise<IPost | null> => {
    const postData = await PostRepo.getPost(id, currentUserId);
    return postData ? this.formatPostData(postData) : null;
  };

  public getUserPosts = async (
    userId: number,
    offset?: number,
    limit?: number,
    excludedIds?: number[],
  ): Promise<IPost[]> => {
    const postsData = await PostRepo.getPostsByUserId(
      userId, offset, limit, excludedIds,
    );
    return postsData.map((postData) => this.formatPostData(postData));
  };

  public deletePost = async (id: number): Promise<void> => {
    const post = await PostRepo.getPost(id);
    if (!post) {
      throw new Error('Post not found');
    }
    await PostRepo.deletePostById(id);
  };

  public likePost = async (postId: number, userId: number): Promise<void> => {
    const newLike: ILike = {
      postId,
      userId,
    };
    try {
      await LikeRepo.create(newLike);
    } catch (e) {
      // TODO: handle errors
      throw new RouteError(
        ErrorsUtil.PostLikeFailed.status,
        ErrorsUtil.PostLikeFailed.message,
      );
    }
    await PostRepo.incLikeCount(postId);
  };

  public unlikePost = async (postId: number, userId: number): Promise<void> => {
    if (!(await LikeRepo.get(postId, userId))) {
      throw new RouteError(HttpStatusCodes.NOT_FOUND, 'Like not found');
    }

    await LikeRepo.delete(postId, userId);
    await PostRepo.decLikeCount(postId);
  };

  public getPostParents = async (id: number): Promise<IPost[]> => {
    return PostRepo.getPostParents(id);
  };

  private formatPostData = (postData: IPostJoins): IPost => {
    const repost = postData.repost && postData.repostUser ? {
      ...postData.repost,
      user: {
        id: postData.repostUser.id,
        nickname: postData.repostUser.name,
        username: postData.repostUser.username,
        profileImageUrl: postData.repostUser.profileImageUrl,
      },
    } : undefined;

    return {
      ...postData.posts,
      user: {
        id: postData.users.id,
        username: postData.users.username,
        nickname: postData.users.name,
        profileImageUrl: postData.users.profileImageUrl,
      },
      liked: !!postData.likes,
      repost,
    };
  };
}

export default new PostService();
