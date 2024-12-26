export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  passwordHash: string;
  profileImageUrl: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  createdAt: string;
  updatedAt: string;
}
