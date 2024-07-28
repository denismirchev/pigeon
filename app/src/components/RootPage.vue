<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { VueCookies } from 'vue-cookies';

export default defineComponent({
  name: 'RootPage',
  setup() {
    const router = useRouter();
    const cookies = useCookies();

    onMounted(() => {
      if (cookies.get('accessToken')) {
        router.push('/home');
      } else {
        router.push('/login');
      }
    });

    return {};
  },
});
</script>