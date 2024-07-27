<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
    <h1 class="text-4xl font-bold mb-4">Welcome to the Home Page</h1>
    <p class="text-lg text-gray-700">This is a simple home page for our application.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default defineComponent({
  name: 'HomePage',
  setup() {
    const isLoggedIn = ref(false);
    const router = useRouter();
    const apiUrl = process.env.VUE_APP_API_URL;

    onMounted(async () => {

    });

    return {};
  },
});
</script>
