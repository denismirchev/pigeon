import { useCookies } from 'vue3-cookies';
import axios from 'axios';
import { User } from '@/types/User';

const apiUrl = process.env.VUE_APP_API_URL;
const { cookies } = useCookies();

async function getUserFromAccessToken(): Promise<User> {
  const token = cookies.get('accessToken');
  if (!token) {
    throw new Error('No access token found');
  }

  try {
    const response = await axios.get(`${apiUrl}/api/users/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data as User;
  } catch (error) {
    // console.error('Error fetching user data:', error);
    throw new Error('Failed to fetch user data');
  }
}

async function logout(): Promise<void> {
  const refreshToken = cookies.get('refreshToken');
  if (!refreshToken) {
    throw new Error('No refresh token found');
  }

  try {
    await axios.post(`${apiUrl}/api/auth/logout`, {
      token: refreshToken,
    });
  } catch (error) {
    // console.error('Error logging out:', error);
    throw new Error('Failed to log out');
  } finally {
    cookies.remove('accessToken');
    cookies.remove('refreshToken');
  }
}

export { getUserFromAccessToken, logout };
