<template>
  <Layout>
    <h1>Single Post</h1>
  </Layout>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, inject } from 'vue';
import { VueCookies } from 'vue-cookies';
import { useRoute } from 'vue-router';
import Layout from '@/components/Layout.vue';

export default defineComponent({
  name: 'SinglePost',
  components: {
    Layout,
  },
  setup() {
    const post = ref(null as any);
    const route = useRoute();
    const apiUrl = process.env.VUE_APP_API_URL;
    const cookies = inject<VueCookies>('$cookies');

    const fetchPost = async () => {
      try {
        const accessToken = cookies?.get('accessToken');
        console.log('Access token:', accessToken);
        const response = await fetch(`${apiUrl}/api/posts/${route.params.id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        console.log('Post:', data);
        post.value = data;
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
