import { useCookies } from 'vue3-cookies';
import axios from 'axios';
import { Post } from '@/types/Post';

const apiUrl = process.env.VUE_APP_API_URL;
const { cookies } = useCookies();

async function createPost(
  content: string,
  userId: number,
  parentId: number | null,
  repostId: number | null,
  selectedFiles: File[],
): Promise<Post> {
  const accessToken = cookies.get('accessToken');
  const formData = new FormData();
  formData.append('content', content);
  formData.append('userId', userId.toString());

  if (parentId !== null) {
    formData.append('parentId', parentId.toString());
  }

  if (repostId !== null) {
    formData.append('repostId', repostId.toString());
  }

  selectedFiles.forEach((file) => formData.append('attachments', file));

  try {
    const response = await axios.post(`${apiUrl}/api/posts`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data as Post;
  } catch (error) {
    throw new Error('Failed to create post');
  }
}

async function likePost(postId: number) {
  const token = cookies.get('accessToken');
  if (!token) {
    throw new Error('No access token found');
  }

  try {
    await axios.post(`${apiUrl}/api/posts/${postId}/like`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw new Error('Failed to like post');
  }
}

async function unlikePost(postId: number) {
  const token = cookies.get('accessToken');
  if (!token) {
    throw new Error('No access token found');
  }

  try {
    await axios.post(`${apiUrl}/api/posts/${postId}/unlike`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw new Error('Failed to unlike post');
  }
}

export { likePost, unlikePost, createPost };
