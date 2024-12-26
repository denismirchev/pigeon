<template>
  <div class="bg-gray-100 flex items-center justify-center min-h-screen">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Register</h2>
      <form @submit.prevent="handleRegister">
        <div v-if="errorMessage" class="mb-4 text-red-500 text-sm">{{ errorMessage }}</div>
        <div class="mb-4">
          <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
          <input v-model="form.username" type="text" id="username" name="username" class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700">Nickname</label>
          <input v-model="form.name" type="text" id="name" name="name" class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="form.email" type="email" id="email" name="email" class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input v-model="form.password" type="password" id="password" name="password" class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div class="mb-4">
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input v-model="form.confirmPassword" type="password" id="confirmPassword" name="confirmPassword" class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div class="mb-6">
          <button type="submit" class="w-full px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500" :disabled="isLoading">
            <span v-if="!isLoading">Register</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </span>
          </button>
        </div>
        <p class="text-center text-sm text-gray-600">Already have an account? <router-link to="/login" class="text-blue-500 hover:underline">Login</router-link></p>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, onMounted, reactive, ref,
} from 'vue';
import { useRouter } from 'vue-router';
import { register } from '@/api/auth';
import { useCookies } from 'vue3-cookies';

export default defineComponent({
  name: 'UserRegister',
  setup() {
    const form = reactive({
      username: '',
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    const isLoading = ref(false);
    const errorMessage = ref('');
    const router = useRouter();
    const { cookies } = useCookies();

    onMounted(() => {
      if (cookies.get('accessToken') && cookies.get('refreshToken')) {
        router.push('/home');
      }
    });

    const handleRegister = async () => {
      errorMessage.value = '';
      if (!form.username || !form.name || !form.email || !form.password || !form.confirmPassword) {
        errorMessage.value = 'All fields are required';
        return;
      }
      if (form.password !== form.confirmPassword) {
        errorMessage.value = 'Passwords do not match';
        return;
      }

      isLoading.value = true;
      try {
        await register(form.username, form.name, form.email, form.password);
        window.location.reload();
      } catch (err: any) {
        errorMessage.value = err.response?.data?.error || err.message;
        if (errorMessage.value) {
          const errorMsg = errorMessage.value;
          errorMessage.value = errorMsg.charAt(0).toUpperCase() + errorMsg.slice(1);
        }
      } finally {
        isLoading.value = false;
      }
    };

    return {
      form,
      isLoading,
      errorMessage,
      handleRegister,
    };
  },
});
</script>
