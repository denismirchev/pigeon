<template>
  <Layout>
    <div class="bg-white border border-gray-200 rounded-lg p-4 mb-4 relative">
      <!-- Back Button -->
      <router-link to="/home" class="text-blue-500 hover:underline">← Back to Home</router-link>

      <!-- Display Parent Posts -->
      <div class="parent-posts-line">
        <Post
          v-for="parentPost in parentPosts"
          :key="parentPost.id"
          :post="parentPost"
          :is-link="true"
        />
      </div>

      <!-- Display Single Post -->
      <Post v-if="post" :post="post" />

      <!-- Loading Message -->
      <div v-else class="text-gray-500 text-center mt-4">Loading post...</div>

      <!-- Comments Section -->
      <RepliesSection v-if="post" :post="post" @reply-added="post.repliesCount += 1" />
    </div>
  </Layout>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  watch,
} from 'vue';
import Layout from '@/components/Layout.vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { useCookies } from 'vue3-cookies';
import { Post } from '@/types/Post';
import RepliesSection from './RepliesSection.vue';
import PostComponent from '../../post/PostComponent.vue';

export default defineComponent({
  name: 'SinglePostPage',
  components: {
    Layout,
    Post: PostComponent,
    RepliesSection,
  },
  setup() {
    const post = ref<Post>();
    const parentPosts = ref<Post[]>([]);
    const route = useRoute();
    const { cookies } = useCookies();
    const apiUrl = process.env.VUE_APP_API_URL;

    const fetchParentPosts = async () => {
      try {
        const accessToken = cookies.get('accessToken');
        const response = await axios.get(`${apiUrl}/api/posts/${route.params.id}/parents`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        parentPosts.value = response.data.reverse();
      } catch (error) {
        console.error('Error fetching parent posts:', error);
      }
    };

    const fetchPost = async () => {
      try {
        const accessToken = cookies.get('accessToken');
        const response = await axios.get(`${apiUrl}/api/posts/${route.params.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        post.value = response.data;
        await fetchParentPosts();
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    onMounted(() => {
      fetchPost();
    });

    watch(route, () => {
      fetchPost();
    });

    return {
      post,
      parentPosts,
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
