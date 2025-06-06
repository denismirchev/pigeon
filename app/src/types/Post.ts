export interface Post {
  id: number;
  userId: number;
  content: string;
  attachments?: string;
  createdAt?: Date;
  updatedAt?: Date;
  parentId?: number;
  likesCount: number;
  repliesCount: number;
  repostsCount: number;
  liked?: boolean;
  user: {
    id: number;
    username: string;
    nickname: string;
    profileImageUrl: string;
  };
  repost?: Post;
}
