<template>
  <Layout>
    <div class="user-info border border-gray-300 p-4 rounded-lg" v-if="user">
      <div class="flex items-start justify-between w-full user-info">
        <div class="flex items-center space-x-6">
          <img :src="`${$apiUrl}/uploads/pfps/${user.profileImageUrl}` || 'https://via.placeholder.com/150'" alt="Profile" class="w-16 h-16 rounded-full" />
          <div>
            <div class="text-xl font-bold">{{ user.name }}</div>
            <div class="text-lg text-gray-500">@{{ user.username }}</div>
          </div>
        </div>
        <div class="flex flex-col space-y-2 text-right">
          <p v-if="user.bio">Bio: <strong>{{ user.bio }}</strong></p>
          <p v-if="user.location">Location: <strong>{{ user.location }}</strong></p>
          <a v-if="user.website" :href="`${user.website}`" target="_blank" rel="noopener noreferrer" class="text-blue-500">{{ user.website }}</a>
        </div>
      </div>
    </div>
    <div class="my-4 border-t border-gray-400"></div>
    <div v-for="post in posts" :key="post.id">
      <PostComponent :post="post" :isLink="true" />
    </div>
    <div v-if="loading" class="loading-indicator">Loading...</div>
  </Layout>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, ref, } from 'vue';
import { VueCookies } from 'vue-cookies';
import Layout from '@/components/Layout.vue';
import PostComponent from '@/components/post/PostComponent.vue';
import TweetBox from '@/components/main/TweetBox.vue';
import { Post } from '@/types/Post';
import { useRoute } from 'vue-router';
import { User } from '@/types/User';

export default defineComponent({
  name: 'UserProfilePage',
  components: {
    PostComponent,
    Layout,
    TweetBox,
  },
  setup() {
    const posts = ref<Post[]>([]);
    const pageOffset = ref(0);
    const loading = ref(false);
    const apiUrl = process.env.VUE_APP_API_URL;
    const cookies = inject<VueCookies>('$cookies');

    const route = useRoute();
    const username = ref(route.params.username as string);

    const user = ref<User>();

    let reachedEnd = false;

    const fetchPosts = async (offset = 0) => {
      loading.value = true;
      try {
        const accessToken = cookies?.get('accessToken');
        const response = await fetch(`${apiUrl}/api/posts/users/${username.value}?offset=${offset}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        if (!data || data.length < 10) {
          console.log('Reached end of posts');
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

    const fetchUser = async () => {
      try {
        const accessToken = cookies?.get('accessToken');
        const response = await fetch(`${apiUrl}/api/users/${username.value}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        user.value = await response.json();
      } catch (error) {
        console.error('Error fetching user:', error);
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
      fetchUser();
      window.addEventListener('scroll', handleScroll);
    });

    return {
      user,
      posts,
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
