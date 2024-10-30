<template>
  <Layout>
    <div class="profile-container max-w-lg mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <div class="profile-header mb-4" v-if="user">
        <img :src="user.profileImageUrl ? user.profileImageUrl : 'https://via.placeholder.com/150'" alt="Profile Picture" class="w-24 h-24 rounded-full mx-auto" />
        <h1 class="text-2xl font-semibold text-center mt-2">{{ user.username }}</h1>
        <p class="text-center text-gray-600">{{ user.name }}</p>
      </div>
      <div class="posts-container">
        <h2 class="text-xl font-semibold mb-4">Posts</h2>
        <div v-for="post in posts" :key="post.id" class="post mb-4">
          {{post.id}}
<!--          <PostComponent :post="post" :isLink="false" />-->
        </div>
        <div v-if="loading" class="loading-indicator">Loading...</div>
      </div>
    </div>
  </Layout>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import Layout from '@/components/Layout.vue';
import PostComponent from '@/components/main/PostComponent.vue';
import { Post } from '@/types/Post';
import { User } from '@/types/User';
import { useCookies } from 'vue3-cookies';

export default defineComponent({
  name: 'UserProfilePage',
  components: {
    Layout,
    PostComponent,
  },
  setup() {
    const route = useRoute();
    const username = ref(route.params.username as string);
    const { cookies } = useCookies();

    const user = ref<User>();
    const posts = ref<Post[]>([]);
    const loading = ref(false);
    const apiUrl = process.env.VUE_APP_API_URL;

    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/users/${username.value}`);
        const data = await response.json();
        user.value = data;
        console.log(data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    const fetchUserPosts = async () => {
      loading.value = true;
      try {
        const accessToken = cookies.get('accessToken');
        const response = await fetch(`${apiUrl}/api/posts/users/${username.value}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        posts.value = data;
        console.log(data);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchUserProfile();
      fetchUserPosts();
    });

    watch(() => route.params.username, (newUsername) => {
      username.value = newUsername as string;
      fetchUserProfile();
      fetchUserPosts();
    });

    return {
      user,
      posts,
      loading,
    };
  },
});
</script>

<style scoped>
.profile-container {
  text-align: center;
}
.loading-indicator {
  text-align: center;
  padding: 20px;
  font-size: 16px;
  color: #666;
}
</style>
