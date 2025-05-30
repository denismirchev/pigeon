<template>
  <div class="bg-gray-100 border border-gray-200 rounded-lg p-4 mt-4">
    <h3 class="font-bold mb-2">Replies</h3>
    <TweetBox @tweet-posted="addNewReply" :parent-id="post.id" />
    <div v-for="reply in replies" :key="reply.id">
      <PostComponent :post="reply" :isLink="true" />
    </div>
    <div v-if="loading" class="loading-indicator">Loading...</div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, onMounted, watch, computed,
} from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { useCookies } from 'vue3-cookies';
import PostComponent from '@/components/post/PostComponent.vue';
import { Post } from '@/types/Post';
import TweetBox from '@/components/post/TweetBox.vue';

export default defineComponent({
  name: 'RepliesSection',
  components: { TweetBox, PostComponent },
  props: {
    post: { type: Object as () => Post, required: true },
  },
  emits: ['replyAdded'],
  setup(props, { emit }) {
    const replies = ref<Post[]>([]);
    const route = useRoute();
    const { cookies } = useCookies();
    const pageOffset = ref(0);
    const loading = ref(false);
    const reachedEnd = ref(false);

    const apiUrl = process.env.VUE_APP_API_URL;

    const fetchReplies = async (offset = 0) => {
      loading.value = true;
      try {
        const accessToken = cookies.get('accessToken');
        const { data } = await axios.get(`${apiUrl}/api/posts/${route.params.id}/replies?offset=${offset}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!data || data.length < 10) {
          reachedEnd.value = true;
        }
        replies.value = offset === 0 ? data : [...replies.value, ...data];
      } catch (error) {
        console.error('Error fetching replies:', error);
      } finally {
        loading.value = false;
      }
    };

    const handleScroll = () => {
      if (reachedEnd.value || loading.value) return;

      const bottom = document.body.offsetHeight - 500;
      if (window.innerHeight + window.scrollY >= bottom) {
        pageOffset.value += 10;
        fetchReplies(pageOffset.value);
      }
    };

    const addNewReply = (newPost: Post) => {
      replies.value.unshift(newPost);
      emit('replyAdded');
    };

    onMounted(() => {
      fetchReplies();
      window.addEventListener('scroll', handleScroll);
    });

    watch(route, () => fetchReplies());

    return {
      replies,
      loading: computed(() => loading.value),
      addNewReply,
      reachedEnd,
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
