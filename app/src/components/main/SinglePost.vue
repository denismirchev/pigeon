<template>
  <Layout>
    <div class="bg-white border border-gray-200 rounded-lg p-4 mb-4 relative">
      <!-- Back Button -->
      <router-link to="/home" class="text-blue-500 hover:underline">← Back to Home</router-link>

      <!-- Display Single Post -->
      <div class="parent-posts-line">
        <Post v-if="post" :post="post" :is-repost="true" :quote="'hello'" />
        <Post v-if="post" :post="post" :is-repost="true" :quote="'hello'" />
      </div>

      <Post v-if="post" :post="post" :is-repost="true" :quote="'hello'" />

      <!-- Loading Message -->
      <div v-else class="text-gray-500 text-center mt-4">Loading post...</div>

      <!-- Comments Section -->
      <RepliesSection v-if="post" :newReply="newReply" :post="post" @resizeTextarea="resizeTextarea" />
    </div>
  </Layout>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, inject, watch, Ref } from 'vue';
import Layout from '@/components/Layout.vue';
import Post from './PostComponent.vue';
import RepliesSection from './RepliesSection.vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { useCookies } from 'vue3-cookies';
import { User } from '@/types/User';

export default defineComponent({
  name: 'SinglePostPage',
  components: {
    Layout,
    Post,
    RepliesSection,
  },
  setup() {
    const post = ref(null as any);
    const newReply = ref('');
    const route = useRoute();
    const { cookies } = useCookies();
    const apiUrl = process.env.VUE_APP_API_URL;

    const fetchPost = async () => {
      try {
        const accessToken = cookies.get('accessToken');
        const response = await axios.get(`${apiUrl}/api/posts/${route.params.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        post.value = response.data;
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    const resizeTextarea = (textarea: HTMLTextAreaElement) => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    };

    onMounted(() => {
      fetchPost();
    });

    watch(route, () => {
      fetchPost();
    });

    return {
      post,
      newReply,
      resizeTextarea,
    };
  },
});
</script>

<style scoped>
.parent-posts-line {
  position: relative;
  padding-left: 20px;
}

.parent-posts-line::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 2px;
  background-color: #ccc;
}
</style>
