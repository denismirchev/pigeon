<template>
  <Layout>
    <div class="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-md">
      <TweetBox
        @tweetPosted="addNewPost"
      />
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
} from 'vue';
import { VueCookies } from 'vue-cookies';
import Layout from '@/components/Layout.vue';
import PostComponent from '@/components/main/PostComponent.vue';
import TweetBox from '@/components/main/TweetBox.vue';
import { Post } from '@/types/Post';

export default defineComponent({
  name: 'HomePage',
  components: {
    PostComponent,
    Layout,
    TweetBox,
  },
  setup() {
    const posts = ref<Post[]>([]);
    const status = ref('');
    const apiUrl = process.env.VUE_APP_API_URL;
    const cookies = inject<VueCookies>('$cookies');

    const fetchPosts = async () => {
      try {
        const accessToken = cookies?.get('accessToken');
        const response = await fetch(`${apiUrl}/api/posts`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        posts.value = data.reverse();
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    const addNewPost = (newPost: Post) => {
      posts.value.unshift(newPost);
    };

    onMounted(() => {
      fetchPosts();
    });

    return {
      posts,
      status,
      addNewPost,
    };
  },
});
</script>
