import { IReq, IRes } from './types/express/misc';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import PostService from '@src/services/PostService';
import UserService from '@src/services/UserService';
import { IPost } from '@src/db/models/Post';

interface ICreatePostReq {
  userId: number;
  content: string;
  attachments?: string;
  parentId?: number;
  repostId?: number;
}

async function createPost(req: IReq<ICreatePostReq>, res: IRes) {
  const { userId, content, parentId, repostId } = req.body;

  if (parentId && repostId) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({
      error: 'Post cannot be both a reply and a repost',
    });
  }

  // TODO add file formatting
  let attachments;
  const files = req.files as Express.Multer.File[];
  if (files && files.length > 0) {
    attachments = files.map((file) => file.filename).join(',');
  }

  const post = await PostService
    .createPost(userId, content, attachments, parentId, repostId);
  if (!post) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({
      error: 'Failed to create post',
    });
  }

  const user = await UserService.getUserById(post.userId);
  if (!user) {
    return res.status(HttpStatusCodes.NOT_FOUND).json({
      error: 'User not found',
    });
  }

  const response = {
    ...post,
    user: {
      id: user.id,
      username: user.username,
      profileImageUrl: user.profileImageUrl,
    },
  };

  return res.status(HttpStatusCodes.OK).json(response);
}

async function getAllPosts(req: IReq, res: IRes) {
  const offset = Number(req.query.offset);
  const limit = Number(req.query.limit);

  const posts: IPost[] = await PostService.getAllPosts(offset, limit);

  const userIds = posts.map((post) => post.userId);
  const users = await UserService.getUsersByIds(userIds);

  if (!res.locals.user?.id) {
    throw new Error('User not found');
  }

  const userId = res.locals.user.id;

  const postsWithUserData = await Promise.all(posts.map(async (post) => {
    const user = users.find((u) => u.id === post.userId);
    if (user) {
      if (!post.id) {
        throw new Error('Post not found');
      }
      const liked = await PostService.isPostLikedByUser(post.id, userId);

      let repostedPost = null;
      if (post.repostId) {
        repostedPost = await PostService.getOnePost(post.repostId);
        if (!repostedPost) {
          throw new Error('Reposted post not found');
        }
        // get user data for reposted post
        const repostedUser = await UserService.getUserById(repostedPost.userId);

        if (!repostedUser) {
          throw new Error('Reposted user not found');
        }

        repostedPost = {
          ...repostedPost,
          user: {
            id: repostedUser.id,
            username: repostedUser.username,
            profileImageUrl: repostedUser.profileImageUrl,
          },
        };
      }

      return {
        ...post,
        user: {
          id: user.id,
          username: user.username,
          profileImageUrl: user.profileImageUrl,
        },
        liked,
        repostedPost,
      };
    }
    return null;
  }));

  return res.status(HttpStatusCodes.OK).json(postsWithUserData);
}

async function getOnePost(req: IReq, res: IRes) {
  const id = Number(req.params.id);
  const post = await PostService.getOnePost(id);
  if (!post) {
    return res.status(HttpStatusCodes.NOT_FOUND).json({
      error: 'Post not found',
    });
  }

  const user = await UserService.getUserById(post.userId);
  if (!user) {
    return res.status(HttpStatusCodes.NOT_FOUND).json({
      error: 'User not found',
    });
  }

  if (!res.locals.user?.id) {
    throw new Error('User not found');
  }
  const liked = await PostService.isPostLikedByUser(id, res.locals.user?.id);

  const { userId, ...postWithoutUserId } = post;

  let repostedPost = null;
  if (post.repostId) {
    repostedPost = await PostService.getOnePost(post.repostId);
    if (!repostedPost) {
      throw new Error('Reposted post not found');
    }
    // get user data for reposted post
    const repostedUser = await UserService.getUserById(repostedPost.userId);

    if (!repostedUser) {
      throw new Error('Reposted user not found');
    }

    repostedPost = {
      ...repostedPost,
      user: {
        id: repostedUser.id,
        username: repostedUser.username,
        profileImageUrl: repostedUser.profileImageUrl,
      },
    };
  }

  const response = {
    ...postWithoutUserId,
    user: {
      id: user.id,
      username: user.username,
      profileImageUrl: user.profileImageUrl,
    },
    liked,
    repostedPost,
  };

  return res.status(HttpStatusCodes.OK).json(response);
}

async function getReplies(req: IReq, res: IRes) {
  const offset = Number(req.query.offset);
  const limit = Number(req.query.limit);

  const id = Number(req.params.id);
  const replies = await PostService.getPostReplies(id, offset, limit);

  const userIds = replies.map((reply) => reply.userId);
  const users = await UserService.getUsersByIds(userIds);

  // add liked field to each reply
  if (!res.locals.user?.id) {
    throw new Error('User not found');
  }

  const userId = res.locals.user.id;

  const repliesWithUserData = await Promise.all(replies.map(async (reply) => {
    const user = users.find((u) => u.id === reply.userId);
    if (!reply.id) {
      throw new Error('Reply not found');
    }
    const liked = await PostService.isPostLikedByUser(reply.id, userId);
    if (user) {
      return {
        ...reply,
        user: {
          id: user.id,
          username: user.username,
          profileImageUrl: user.profileImageUrl,
        },
        liked,
      };
    }
    return null;
  }));

  return res.status(HttpStatusCodes.OK).json(repliesWithUserData);
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

async function likePost(req: IReq, res: IRes) {
  const user = res.locals.user;
  if (!user) {
    return res.status(HttpStatusCodes.UNAUTHORIZED).json({
      error: 'Unauthorized',
    });
  }

  const postId = Number(req.params.id);
  // const post = await PostService.getOnePost(postId);
  // if (!post) {
  //   return res.status(HttpStatusCodes.NOT_FOUND).json({
  //    error: 'Post not found',
  //   });
  // }

  if (!user.id) {
    throw new Error('User not found');
  }

  await PostService.likePost(postId, user.id);
  return res.status(HttpStatusCodes.OK).json({
    message: 'Post liked successfully',
  });
}

async function unlikePost(req: IReq, res: IRes) {
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

  if (!user.id) {
    throw new Error('User not found');
  }

  await PostService.unlikePost(postId, user.id);
  return res.status(HttpStatusCodes.OK).json({
    message: 'Post unliked successfully',
  });
}

const getParents = async (req: IReq, res: IRes) => {
  const id = Number(req.params.id);
  const post = await PostService.getOnePost(id);
  if (!post) {
    return res.status(HttpStatusCodes.NOT_FOUND).json({
      error: 'Post not found',
    });
  }

  const parents = await PostService.getOneParents(id);

  const parentsWithUserData = await Promise.all(parents.map(async (parent) => {
    const user = await UserService.getUserById(parent.userId);
    // console.log(user);
    if (user) {
      return {
        ...parent,
        user: {
          id: user.id,
          username: user.username,
          profileImageUrl: user.profileImageUrl,
        },
      };
    }
    return null;
  }));

  // console.log(parentsWithUserData);

  return res.status(HttpStatusCodes.OK).json(parentsWithUserData);
};

export default {
  createPost,
  getAllPosts,
  getOnePost,
  getUserPosts,
  deletePost,
  getReplies,
  likePost,
  unlikePost,
  getParents,
} as const;

