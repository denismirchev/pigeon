<template>
  <div class="bg-gray-100 flex items-center justify-center min-h-screen">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
      <form @submit.prevent="login">
        <div v-if="errorMessage" class="mb-4 text-red-500 text-sm">{{ errorMessage }}</div>
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="form.email" type="email" id="email" name="email" class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input v-model="form.password" type="password" id="password" name="password" class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div class="mb-6">
          <button type="submit" class="w-full px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500" :disabled="isLoading">
            <span v-if="!isLoading">Login</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </span>
          </button>
        </div>
        <p class="text-center text-sm text-gray-600">Don't have an account? <router-link to="/register" class="text-blue-500 hover:underline">Register</router-link></p>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, inject, reactive, ref, onMounted, provide,
} from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { VueCookies } from 'vue-cookies';
import { User } from '@/types/User';
import { getUserFromAccessToken } from '@/api/auth';

export default defineComponent({
  name: 'UserLogin',
  setup() {
    const form = reactive({
      email: '',
      password: '',
    });

    const isLoading = ref(false);
    const errorMessage = ref('');
    const apiUrl = process.env.VUE_APP_API_URL;
    const cookies = inject<VueCookies>('$cookies');
    const router = useRouter();

    onMounted(() => {
      if (cookies?.get('accessToken') && cookies?.get('refreshToken')) {
        router.push('/home');
      }
    });

    const areFieldsEmpty = () => !form.email || !form.password;

    const login = async () => {
      errorMessage.value = '';
      if (areFieldsEmpty()) {
        errorMessage.value = 'All fields are required';
        return;
      }

      isLoading.value = true;
      try {
        const { data } = await axios.post(`${apiUrl}/api/auth/login`, form);
        cookies?.set('accessToken', data.accessToken);
        cookies?.set('refreshToken', data.refreshToken, '30d');
        // TODO: use router.push('/home') instead of page reload and fix user provide func
        router.go(0);
      } catch (error: any) {
        if (error.response?.status === 401) {
          errorMessage.value = 'Invalid email or password';
        } else {
          errorMessage.value = `Login failed: ${error.response?.data?.message || error.message}`;
        }
      } finally {
        isLoading.value = false;
      }
    };

    return {
      form,
      isLoading,
      errorMessage,
      login,
    };
  },
});
</script>
