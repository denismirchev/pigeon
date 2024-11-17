<template>
  <aside class="grid grid-rows-[auto,1fr] h-screen w-full lg:w-1/4 lg:pr-4 mb-4 lg:mb-0 sticky top-5">
    <div class="flex flex-col">
      <div class="flex items-center space-x-2 pb-8">
        <img :src="icon" alt="Pigeon Icon" class="w-10 h-10 logo-icon" />
        <div class="text-xl font-bold text-blue-500">Pigeon</div>
      </div>
      <nav class="space-y-2">
        <router-link to="/home" class="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-gray-200">
          <img src="../../assets/icons/home.svg" alt="Home" class="w-6 h-6" />
          <span>Home</span>
        </router-link>
        <router-link :to="`/${user?.username}`" class="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-gray-200">
          <img src="../../assets/icons/profile.svg" alt="Profile" class="w-6 h-6" />
          <span>Profile</span>
        </router-link>
      </nav>
      <div class="mt-10 space-y-2">
        <div class="relative px-4 py-2">
          <div class="flex items-center justify-between space-x-2">
            <div class="flex items-center space-x-2">
              <img :src="`${$apiUrl}/uploads/pfps/${user?.profileImageUrl}` || 'https://via.placeholder.com/150'" alt="User Avatar" class="w-10 h-10 rounded-full">
              <div>
                <span class="block font-medium">{{ user?.name || 'Loading...' }}</span>
              </div>
            </div>
            <div class="relative">
              <button ref="dropdownButton" @click="toggleDropdown" class="focus:outline-none" type="button">
                <span class="text-2xl">⋮</span>
              </button>
              <div ref="dropdownMenu" class="dropdown hidden absolute right-0 top-full mt-2 w-48 bg-white border rounded-lg shadow-lg">
                <router-link to="/settings" class="block px-4 py-2 hover:bg-gray-100">Settings</router-link>
                <button @click="logout" class="w-full text-left px-4 py-2 hover:bg-gray-100" type="button">Logout</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script lang="ts">
import {
  defineComponent, ref, inject, watch, Ref,
} from 'vue';
import { useRouter } from 'vue-router';
import { User } from '@/types/User';
import { logout } from '@/api/auth';
import icon from '@/../public/logo.svg';

export default defineComponent({
  name: 'SidebarComponent',
  setup() {
    const router = useRouter();
    const dropdownMenu = ref<HTMLElement | null>(null);
    const dropdownButton = ref<HTMLElement | null>(null);
    const user = inject('user') as Ref<User>;

    const toggleDropdown = (event: Event) => {
      event.stopPropagation();
      if (dropdownMenu.value) {
        dropdownMenu.value.classList.toggle('hidden');
      }
    };

    watch(user, (newUser) => {
      console.log('User updated:', newUser);
    });

    const handleLogout = async () => {
      try {
        await logout();
      } finally {
        await router.push('/login');
      }
    };

    return {
      toggleDropdown,
      dropdownMenu,
      dropdownButton,
      logout: handleLogout,
      user,
      icon,
    };
  },
});
</script>

<style scoped>
.relative:focus-within .dropdown {
  display: block;
}

.dropdown {
  display: none;
}

.logo-icon {
  filter: invert(29%) sepia(83%) saturate(748%) hue-rotate(183deg) brightness(95%) contrast(101%);
}
</style>
