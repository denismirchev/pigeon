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
    throw new Error('Failed to fetch user data');
  }
}

async function logout(): Promise<void> {
  try {
    const refreshToken = cookies.get('refreshToken');
    await axios.post(`${apiUrl}/api/auth/logout`, {
      token: refreshToken,
    });
  } catch (error) {
    //
  } finally {
    cookies.remove('accessToken');
    cookies.remove('refreshToken');
  }
}

async function login(email: string, password: string): Promise<void> {
  const { data } = await axios.post(`${apiUrl}/api/auth/login`, { email, password });
  cookies.set('accessToken', data.accessToken);
  cookies.set('refreshToken', data.refreshToken, '30d');
}

async function register(username: string, nickname: string, email: string, password: string)
  : Promise<void> {
  await axios.post(`${apiUrl}/api/auth/register`, {
    username, name: nickname, email, password,
  });
  const { data } = await axios.post(`${apiUrl}/api/auth/login`, { email, password });
  cookies.set('accessToken', data.accessToken);
  cookies.set('refreshToken', data.refreshToken, '30d');
}

export {
  getUserFromAccessToken, logout, login, register,
};
