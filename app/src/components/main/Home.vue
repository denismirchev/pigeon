<template>
  <Layout>
    <div class="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-md">
      <TweetBox @tweetPosted="addNewPost" />
    </div>
    <!-- Render fetched posts -->
    <div v-for="post in posts" :key="post.id">
      <PostComponent :post="post" :isLink="true" />
    </div>
    <!-- Loading indicator -->
    <div v-if="loading" class="loading-indicator">Loading...</div>
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
    const pageOffset = ref(0);
    const loading = ref(false);
    const apiUrl = process.env.VUE_APP_API_URL;
    const cookies = inject<VueCookies>('$cookies');

    let reachedEnd = false;

    const fetchPosts = async (offset = 0) => {
      loading.value = true;
      try {
        const accessToken = cookies?.get('accessToken');
        const response = await fetch(`${apiUrl}/api/posts?offset=${offset}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        if (!data || data.length < 10) {
          reachedEnd = true;
        }
        if (offset === 0) {
          posts.value = data;
        } else {
          posts.value = [...posts.value, ...data];
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        loading.value = false;
      }
    };

    const addNewPost = (newPost: Post) => {
      posts.value.unshift(newPost);
    };

    const handleScroll = () => {
      if (reachedEnd) {
        return;
      }

      const bottom = document.body.offsetHeight - 500;
      if ((window.innerHeight + window.scrollY) >= bottom && !loading.value) {
        pageOffset.value += 10;
        fetchPosts(pageOffset.value);
      }
    };

    onMounted(() => {
      fetchPosts();
      window.addEventListener('scroll', handleScroll);
    });

    return {
      posts,
      status,
      addNewPost,
      loading,
    };
  },
});
</script>

<style scoped>
.loading-indicator {
  text-align: center;
  padding: 20px;
  font-size: 16px;
  color: #666;
}
</style>
