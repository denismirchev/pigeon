<template>
  <div class="bg-gray-100 flex items-center justify-center min-h-screen">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="form.email" type="email" id="email" name="email" class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input v-model="form.password" type="password" id="password" name="password" class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div class="mb-6">
          <button type="submit" class="w-full px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Login</button>
        </div>
        <p class="text-center text-sm text-gray-600">Don't have an account? <router-link to="/register" class="text-blue-500 hover:underline">Register</router-link></p>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, reactive, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { VueCookies } from "vue-cookies";

export default defineComponent({
  name: 'UserLogin',
  setup() {
    const form = reactive({
      email: '',
      password: '',
    });

    const apiUrl = process.env.VUE_APP_API_URL;
    const cookies = inject<VueCookies>('$cookies');
    const router = useRouter();

    onMounted(() => {
      const hasAccessToken = cookies?.get('accessToken');
      const hasRefreshToken = cookies?.get('refreshToken');

      if (hasAccessToken && hasRefreshToken) {
        router.push('/home');
      }
    });

    const login = async () => {
      try {
        const response = await axios.post(`${apiUrl}/api/auth/login`, {
          email: form.email,
          password: form.password,
        });
        console.log('Login successful:', response.data);

        // Save tokens to cookies
        cookies?.set('accessToken', response.data.accessToken);
        cookies?.set('refreshToken', response.data.refreshToken);

        await router.push('/home');
      } catch (error) {
        console.error('Login failed:', error);
        // Handle login error (e.g., show error message to user)
      }
    };

    return {
      form,
      login,
    };
  },
});
</script>