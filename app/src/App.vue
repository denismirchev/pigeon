<template>
  <router-view />
</template>

<script lang="ts">
import {
  defineComponent, onMounted, provide, ref,
} from 'vue';
import { getUserFromAccessToken, logout } from '@/api/auth';
import { User } from '@/types/User';

export default defineComponent({
  name: 'App',
  setup() {
    const user = ref<User>();

    provide('user', user);

    onMounted(async () => {
      // Check if the access token is still valid
      // If it is, fetch the user data
      // If it's not, log the user out
      try {
        user.value = await getUserFromAccessToken();
      } catch (error) {
        // console.error(error);
        try {
          await logout();
        } catch (logoutError) {
          // console.error(logoutError);
        }
      }
    });

    return {
      user,
    };
  },
});
</script>
