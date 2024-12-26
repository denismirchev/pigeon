<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
    <h1 class="text-4xl font-bold mb-4">Welcome to the Home Page</h1>
    <p class="text-lg text-gray-700">This is a simple home page for our application.</p>
    <button @click="logout" class="mt-6 px-4 py-2 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">Logout</button>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, onMounted, inject} from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { VueCookies } from 'vue-cookies';

export default defineComponent({
  name: 'HomePage',
  setup() {
    const isLoggedIn = ref(false);
    const router = useRouter();
    const cookies = inject<VueCookies>('$cookies');
    const apiUrl = process.env.VUE_APP_API_URL;

    const logout = async () => {
      await axios.post(`${apiUrl}/api/auth/logout`, {
        token: cookies?.get('refreshToken'),
      });

      cookies?.remove('accessToken');
      cookies?.remove('refreshToken');
      await router.push('/login');
    };

    onMounted(async () => {
      // Any additional logic on mount
    });

    return {
      logout,
    };
  },
});
</script>