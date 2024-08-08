<template>
  <router-view />
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  provide,
  onMounted,
} from 'vue';
import axios from 'axios';
import { useCookies } from 'vue3-cookies';

export default defineComponent({
  name: 'App',
  setup() {
    const { cookies } = useCookies();
    const user = ref(null);

    provide('user', user);

    onMounted(async () => {
      const apiURL = process.env.VUE_APP_API_URL;

      try {
        const token = cookies.get('accessToken');
        if (token) {
          const response = await axios.get(`${apiURL}/api/users/user`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          user.value = response.data;
          console.log('User data:', response.data);
        } else {
          console.error('No access token found in cookies');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    });

    return {
      user,
    };
  },
});
</script>
