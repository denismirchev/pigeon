export interface Reply {
  id: number;
  user: {
    username: string;
    profileImageUrl: string;
  };
  content: string;
}
