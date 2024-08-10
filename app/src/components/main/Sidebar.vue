<template>
  <aside class="relative flex flex-col justify-between h-[100vh] w-full lg:w-1/4 lg:pr-4 mb-4 lg:mb-0">
    <div class="sticky top-0 left-0 w-full lg:w-full" style="transform: translateY(0);">
      <nav class="space-y-2">
        <router-link to="/home" class="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-gray-200">
          <span class="text-xl">🏠</span>
          <span>Home</span>
        </router-link>
        <router-link to="/explore" class="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-gray-200">
          <span class="text-xl">🔍</span>
          <span>Explore</span>
        </router-link>
        <router-link to="/notifications" class="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-gray-200">
          <span class="text-xl">🔔</span>
          <span>Notifications</span>
        </router-link>
        <router-link to="/messages" class="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-gray-200">
          <span class="text-xl">✉️</span>
          <span>Messages</span>
        </router-link>
      </nav>

      <!-- User Info and Three Dots Menu at the bottom -->
      <div class="relative px-4 py-2 mt-10">
        <div class="flex items-center justify-between space-x-2">
          <div class="flex items-center space-x-2">
            <img :src="user?.avatar || 'https://via.placeholder.com/150'" alt="User Avatar" class="w-10 h-10 rounded-full">
            <div>
              <span class="block font-medium">{{ user?.name || 'Loading...' }}</span>
            </div>
          </div>
          <!-- Three Dots Menu -->
          <div class="relative">
            <button ref="dropdownButton" @click="toggleDropdown" class="focus:outline-none">
              <span class="text-2xl">⋮</span>
            </button>

            <!-- Dropdown Menu -->
            <div ref="dropdownMenu" class="dropdown hidden absolute right-0 top-full mt-2 w-48 bg-white border rounded-lg shadow-lg">
              <router-link to="/profile" class="block px-4 py-2 hover:bg-gray-100">View Profile</router-link>
              <button @click="logout" class="w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  inject,
  watch, onMounted,
} from 'vue';
import { useRouter } from 'vue-router';
import { useCookies } from 'vue3-cookies';
import axios from 'axios';
import {IUser} from "@/types/IUser";

export default defineComponent({
  name: 'Sidebar',
  setup() {
    const router = useRouter();
    const { cookies } = useCookies();
    const apiUrl = process.env.VUE_APP_API_URL;

    const dropdownMenu = ref<HTMLElement | null>(null);
    const dropdownButton = ref<HTMLElement | null>(null);

    const user: IUser = inject('user') as IUser;

    const toggleDropdown = (event: Event) => {
      event.stopPropagation();
      if (dropdownMenu.value) {
        dropdownMenu.value.classList.toggle('hidden');
      }
    };

    const logout = async () => {
      await axios.post(`${apiUrl}/api/auth/logout`, {
        token: cookies?.get('refreshToken'),
      });

      cookies.remove('accessToken');
      cookies.remove('refreshToken');

      await router.push('/login');
    };

    return {
      toggleDropdown,
      dropdownMenu,
      dropdownButton,
      logout,
      user,
    };
  },
});
</script>

<style scoped>
/* Dropdown visibility controlled by focus-within */
.relative:focus-within .dropdown {
  display: block;
}

.dropdown {
  display: none;
}
</style>
