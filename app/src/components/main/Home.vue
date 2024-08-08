<template>
  <Layout>
    <div class="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <label for="status" />
      <textarea id="status" placeholder="What's happening?" class="w-full border border-gray-200 rounded-lg p-4" v-model="status" />
      <div class="flex justify-end mt-2">
        <button type="button" class="px-4 py-2 bg-blue-500 text-white rounded-full" @click="postTweet">Tweet</button>
      </div>
    </div>
    <!-- Render fetched posts -->
    <div v-for="post in posts" :key="post.id" class="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <router-link :to="`/${post.user.username}/${post.id}`" class="block hover:bg-gray-100 hover:shadow-lg transition duration-300">
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
      </router-link>
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
import { VueCookies } from 'vue-cookies';
import Layout from '@/components/Layout.vue';
import axios from "axios";

export default defineComponent({
  name: 'HomePage',
  components: {
    Layout,
  },
  setup() {
    const posts = ref([] as Array<{
      id: number,
      profileImage: string,
      userName: string,
      userHandle: string,
      content: string,
      comments: number,
      retweets: number,
      likes: number,
      user: {
        id: number,
        username: string,
        email: string,
        profileImageUrl: string,
        createdAt: string,
        updatedAt: string
      },
    }>);
    const status = ref('');
    const apiUrl = process.env.VUE_APP_API_URL;
    const cookies = inject<VueCookies>('$cookies');

    const fetchPosts = async () => {
      try {
        const accessToken = cookies?.get('accessToken');
        console.log('Access token:', accessToken);
        const response = await fetch(`${apiUrl}/api/posts`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        console.log('Posts:', data);
        posts.value = data.reverse();
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    const postTweet = async () => {
      try {
        const accessToken = cookies?.get('accessToken');
        console.log('Access token:', accessToken);
        const response = await axios.post(`${apiUrl}/api/posts`, {
          content: status.value,
          userId: 1,
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Add the new post to the beginning of the posts array
        posts.value.unshift(response.data);
        status.value = '';
      } catch (error) {
        console.error('Error posting tweet:', error);
      }
    };

    onMounted(() => {
      fetchPosts();
    });

    return {
      posts,
      status,
      postTweet,
    };
  },
});
</script>