import PostService from '@src/services/PostService';
import PostRepo from '@src/db/repos/PostRepo';
import LikeRepo from '@src/db/repos/LikeRepo';
import RouteError from '@src/common/RouteError';
import UserRepo from '@src/db/repos/UserRepo';
import AuthService from '@src/services/AuthService';
import { IPost } from '@src/db/models/Post';


describe('PostService', () => {
  let userId: number;
  let postId: number;

  beforeEach(async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const nickname = 'Test User';
    const username = 'testuser';

    await UserRepo.deleteUserByEmail('test@example.com');
    await AuthService.register(
      email,
      password,
      nickname,
      username,
    );
    const user = await AuthService.login(email, password);
    if (!user || !user.id) {
      throw new Error('User not found');
    }
    userId = user.id;

    const post = await PostService.createPost(userId, 'test');
    if (!post || !post.id) {
      throw new Error('Post not found');
    }
    postId = post.id;
  });

  afterEach(async () => {
    await LikeRepo.delete(postId, userId);
    await PostRepo.deletePostById(postId);
  });

  describe('createPost', () => {
    it('should create a post', async () => {
      const post = await PostService.createPost(userId, 'test');
      expect(post).toEqual(jasmine.objectContaining({
        userId,
        content: 'test',
      }));
    });

    // eslint-disable-next-line max-len
    it('should throw an error if post is both a reply and a repost', async () => {
      await expectAsync(PostService.createPost(1, 'test', undefined, 10, 10))
        .toBeRejectedWithError();
    });
  });

  describe('getPosts', () => {
    it('should return posts', async () => {
      const posts = await PostService.getPosts();
      posts.forEach(post => {
        expect(post).toEqual(jasmine.objectContaining<IPost>({
          userId: jasmine.any(Number),
          content: jasmine.any(String),
        }));
      });
    });
  });

  describe('getPost', () => {
    it('should return a post', async () => {
      const post = await PostService.getPost(postId);
      expect(post).toEqual(jasmine.objectContaining({ userId, id: postId }));
    });
  });

  describe('likePost', () => {
    it('should like a post', async () => {
      try {
        await PostService.unlikePost(postId, userId);
      } catch (e) {
        // ignore
      }
      await PostService.likePost(postId, userId);
      const like = await LikeRepo.get(postId, userId);
      expect(like).toBeTruthy();
    });

    it('should throw an error if like creation fails', async () => {
      try {
        await PostService.unlikePost(postId, userId);
      } catch (e) {
        // ignore
      }
      await PostService.likePost(postId, userId);
      await expectAsync(PostService.likePost(postId, userId))
        .toBeRejectedWithError(RouteError);
    });
  });

  describe('unlikePost', () => {
    it('should unlike a post', async () => {
      await PostService.likePost(postId, userId);
      await PostService.unlikePost(postId, userId);
      const like = await LikeRepo.get(postId, userId);
      expect(like).toBeFalsy();
    });

    it('should throw an error if like not found', async () => {
      try {
        await PostService.unlikePost(postId, userId);
      } catch (e) {
        // ignore
      }
      await expectAsync(PostService.unlikePost(postId, userId))
        .toBeRejectedWithError(RouteError);
    });
  });
});
