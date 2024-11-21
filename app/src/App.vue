<template>
  <router-view />
</template>

<script lang="ts">
import {
  defineComponent, onMounted, provide, ref,
} from 'vue';
import { getUserFromAccessToken, logout } from '@/api/auth';
import { User } from '@/types/User';
import router from '@/router';

export default defineComponent({
  name: 'App',
  setup() {
    const user = ref<User>();

    provide('user', user);

    onMounted(async () => {
      // Check if the access token is still valid
      // If true fetch the user data, else log the user out
      try {
        user.value = await getUserFromAccessToken();
      } catch (error) {
        try {
          await logout();
        } finally {
          await router.push('/login');
        }
      }
    });

    return {
      user,
    };
  },
});
</script>
