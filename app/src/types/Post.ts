export interface Post {
  id: number;
  userId: number;
  content: string;
  attachments?: string;
  createdAt?: Date;
  updatedAt?: Date;
  parentId?: number;
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  liked?: boolean;
  user: {
    id: number;
    username: string;
    profileImageUrl: string;
  };
}
