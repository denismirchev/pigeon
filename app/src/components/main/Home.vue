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
    <div v-for="post in posts" :key="post.id">
      <PostComponent :post="post" :isLink="true" />
    </div>
  </Layout>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  inject,
  Ref,
} from 'vue';
import { VueCookies } from 'vue-cookies';
import Layout from '@/components/Layout.vue';
import axios from 'axios';
import { User } from "@/types/User";
import PostComponent from "@/components/main/Post.vue";

export default defineComponent({
  name: 'HomePage',
  components: {
    PostComponent,
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
    const user = inject('user') as Ref<User>;

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
          userId: `${user.value.id}`,
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
