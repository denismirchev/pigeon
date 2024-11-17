<template>
  <div class="flex items-center justify-center min-h-screen">
    <div>
      <h1 class="text-4xl font-bold">404 - Page Not Found</h1>
      <p class="mt-4 text-lg">Redirecting in a few seconds...</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'RouteNotFound',
  setup() {
    const router = useRouter();

    // Redirect to the pages page after 5 seconds
    setTimeout(() => {
      router.push('/');
    }, 5000);
  },
});
</script>
