<template>
  <div class="bg-gray-100 border border-gray-200 rounded-lg p-4 mt-4">
    <h3 class="font-bold mb-2">Replies</h3>
    <TweetBox @tweet-posted="addNewReply" :parent-id="post.id" />
    <div v-for="reply in replies" :key="reply.id">
      <PostComponent :post="reply" :isLink="true" />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  watch, provide,
} from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { useCookies } from 'vue3-cookies';
import PostComponent from '@/components/main/PostComponent.vue';
import { Post } from '@/types/Post';
import TweetBox from '@/components/main/TweetBox.vue';

export default defineComponent({
  name: 'RepliesSection',
  components: { TweetBox, PostComponent },
  props: {
    newReply: { type: String, required: true },
    post: { type: Object as () => Post, required: true },
  },
  setup(props) {
    const replies = ref<Post[]>([]);
    const route = useRoute();
    const { cookies } = useCookies();
    const textarea = ref<HTMLTextAreaElement | null>(null);

    const apiUrl = process.env.VUE_APP_API_URL;

    const fetchReplies = async () => {
      try {
        const accessToken = cookies.get('accessToken');
        const { data } = await axios.get(`${apiUrl}/api/posts/${route.params.id}/replies`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        replies.value = data.reverse();
      } catch (error) {
        console.error('Error fetching replies:', error);
      }
    };

    const autoResizeTextarea = () => {
      if (textarea.value) {
        textarea.value.style.height = 'auto';
        textarea.value.style.height = `${textarea.value.scrollHeight}px`;
      }
    };

    const formatReplyContent = (content: string) => content.replace(/\n/g, '<br>');

    const addNewReply = (newPost: Post) => {
      replies.value.unshift(newPost);
      props.post.repliesCount++;
    };

    onMounted(fetchReplies);

    watch(route, fetchReplies);

    return {
      replies,
      textarea,
      autoResizeTextarea,
      formatReplyContent,
      addNewReply,
    };
  },
});
</script>
