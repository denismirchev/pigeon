<template>
  <Layout>
    <div class="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <!-- Back Button -->
      <router-link to="/home" class="text-blue-500 hover:underline">← Back to Home</router-link>

      <!-- Display single post -->
      <div v-if="post" class="bg-white border border-gray-200 rounded-lg p-4 mt-4">
        <div class="flex items-center space-x-4">
          <img :src="post.user.profileImageUrl || 'https://via.placeholder.com/150'" :alt="'Profile'" class="w-10 h-10 rounded-full">
          <div>
            <div class="font-bold">{{ post.user.username }}</div>
            <div class="text-sm text-gray-500">{{ post.userHandle }}</div>
          </div>
        </div>
        <div class="mt-4">
          {{ post.content }}
        </div>
        <div class="flex justify-between mt-4 text-gray-500">
          <span>💬 {{ post.comments }}</span>
          <span>🔁 {{ post.retweets }}</span>
          <span>❤️ {{ post.likes }}</span>
          <span>📤</span>
        </div>
      </div>

      <!-- If post is not found -->
      <div v-else class="text-gray-500 text-center mt-4">Loading post...</div>
    </div>
  </Layout>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  inject,
} from 'vue';
import Layout from '@/components/Layout.vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { useCookies } from 'vue3-cookies';

export default defineComponent({
  name: 'SinglePostPage',
  components: {
    Layout,
  },
  setup() {
    const post = ref(null as any);
    const route = useRoute();
    const apiUrl = process.env.VUE_APP_API_URL;
    const { cookies } = useCookies();

    const fetchPost = async () => {
      try {
        const accessToken = cookies.get('accessToken');
        const postId = route.params.id;
        const response = await axios.get(`${apiUrl}/api/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        post.value = response.data;
        console.log('Post data:', response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    onMounted(() => {
      fetchPost();
    });

    return {
      post,
    };
  },
});
</script>
