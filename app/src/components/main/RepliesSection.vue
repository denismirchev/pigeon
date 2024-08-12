<template>
  <div class="bg-gray-100 border border-gray-200 rounded-lg p-4 mt-4">
    <h3 class="font-bold mb-2">Replies</h3>
    <div class="relative mb-4">
      <label for="new-reply" class="sr-only">Reply</label>
      <textarea
        id="new-reply"
        v-model="newReply"
        @input="autoResizeTextarea"
        class="w-full p-2 border rounded-lg resize-none overflow-hidden"
        rows="2"
        placeholder="Reply..."
        ref="textarea"
      />
      <div class="flex justify-end mt-2">
        <button
          type="button"
          @click="submitReply"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Submit
        </button>
      </div>
    </div>

    <div
      v-for="reply in replies"
      :key="reply.id"
    >
<!--      <router-link-->
<!--        :to="`/${reply.user.username}/${reply.id}`"-->
<!--        class="block hover:bg-gray-200"-->
<!--      >-->
        <PostComponent :post="reply" :isLink="true" />
<!--      </router-link>-->
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  inject,
  watch,
  Ref,
} from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { useCookies } from 'vue3-cookies';
import { User } from '@/types/User';
import { Reply } from '@/types/Reply';
import PostComponent from '@/components/main/Post.vue';

export default defineComponent({
  name: 'RepliesSection',
  components: { PostComponent },
  setup() {
    const replies = ref<Reply[]>([]);
    const newReply = ref<string>('');
    const route = useRoute();
    const { cookies } = useCookies();
    const user = inject<Ref<User>>('user');
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

    const submitReply = async () => {
      if (!newReply.value.trim()) return;

      try {
        const accessToken = cookies.get('accessToken');
        const { data } = await axios.post(
          `${apiUrl}/api/posts`,
          {
            content: newReply.value,
            userId: `${user?.value.id}`,
            parentId: route.params.id,
          },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );
        replies.value.unshift(data);
        newReply.value = '';
      } catch (error) {
        console.error('Error posting reply:', error);
      }
    };

    const autoResizeTextarea = () => {
      if (textarea.value) {
        textarea.value.style.height = 'auto';
        textarea.value.style.height = `${textarea.value.scrollHeight}px`;
      }
    };

    const formatReplyContent = (content: string) => content.replace(/\n/g, '<br>');

    onMounted(fetchReplies);

    watch(route, fetchReplies);

    return {
      replies,
      newReply,
      textarea,
      autoResizeTextarea,
      submitReply,
      formatReplyContent,
    };
  },
});
</script>
