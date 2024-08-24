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
      // Check if the user is logged in
      const apiURL = process.env.VUE_APP_API_URL;

      try {
        const token = cookies.get('accessToken');
        if (!token) {
          throw new Error('No access token found');
        }
        const response = await axios.get(`${apiURL}/api/users/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        user.value = response.data;
        console.log('User data:', response.data);
      } catch (error) {
        console.log('USER IS NOT LOGGED IN');
        // console.error('Error fetching user data:', error);
        cookies.remove('accessToken');
        // TODO: maybe request logout from the server
        cookies.remove('refreshToken');
      }
    });

    return {
      user,
    };
  },
});
</script>
