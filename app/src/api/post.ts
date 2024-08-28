import {useCookies} from "vue3-cookies";
import axios from "axios";

const apiUrl = process.env.VUE_APP_API_URL;
const { cookies } = useCookies();

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

export { likePost, unlikePost };
