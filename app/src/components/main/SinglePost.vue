<template>
  <Layout>
    <div class="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <!-- Back Button -->
      <router-link to="/home" class="text-blue-500 hover:underline">← Back to Home</router-link>

      <!-- Display single post -->
      <div v-if="post" class="bg-white border border-gray-200 rounded-lg p-4 mt-4">
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
          <span>💬 {{ post.comments.length }}</span>
          <span>🔁 {{ post.retweets }}</span>
          <span>❤️ {{ post.likes }}</span>
          <span>📤</span>
        </div>
      </div>

      <!-- If post is not found -->
      <div v-else class="text-gray-500 text-center mt-4">Loading post...</div>

      <!-- Comments Section -->
      <div v-if="post" class="bg-gray-100 border border-gray-200 rounded-lg p-4 mt-4">
        <h3 class="font-bold mb-2">Replies</h3>

        <!-- Comment Input Field -->
        <div class="relative mb-4">
          <textarea v-model="newComment" @input="resizeTextarea" ref="commentTextarea" class="w-full p-2 border rounded-lg" rows="2" placeholder="Reply..."></textarea>
          <div class="flex justify-end mt-2">
            <button @click="submitComment" class="px-4 py-2 bg-blue-500 text-white rounded-lg">Submit</button>
          </div>
        </div>

        <div v-for="reply in replies" :key="reply.id" class="bg-white border border-gray-200 rounded-lg p-4 mb-4">
          <router-link :to="`/comments/${reply.id}`" class="block hover:bg-gray-200 hover:animate-fade">
            <div class="flex items-center space-x-4">
              <img :src="reply.user.profileImageUrl || 'https://via.placeholder.com/50'" :alt="'Profile'" class="w-8 h-8 rounded-full">
              <div>
                <div class="font-bold">{{ reply.user.username }}</div>
                <div class="text-sm text-gray-500">{{ reply.content }}</div>
              </div>
            </div>
            <div class="flex justify-between mt-4 text-gray-500">
              <span>💬 0</span>
              <span>🔁 0</span>
              <span>❤️ 0</span>
              <span>📤</span>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  inject, Ref,
} from 'vue';
import Layout from '@/components/Layout.vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { useCookies } from 'vue3-cookies';
import { User } from '@/types/User';

export default defineComponent({
  name: 'SinglePostPage',
  inject: ['user'],
  components: {
    Layout,
  },
  setup() {
    const post = ref(null as any);
    const newComment = ref('');
    const route = useRoute();
    const apiUrl = process.env.VUE_APP_API_URL;
    const { cookies } = useCookies();
    const commentTextarea = ref<HTMLTextAreaElement | null>(null);

    const replies = ref(null as any);

    const fetchPost = async () => {
      try {
        const accessToken = cookies.get('accessToken');
        const postId = route.params.id;
        const response = await axios.get(`${apiUrl}/api/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        post.value = response.data;

        // Add hardcoded comments
        post.value.comments = [
          {
            id: 1,
            user: {
              profileImageUrl: 'https://via.placeholder.com/50',
              username: 'User1',
            },
            content: 'This is a great post!',
          },
          {
            id: 2,
            user: {
              profileImageUrl: 'https://via.placeholder.com/50',
              username: 'User2',
            },
            content: 'Thanks for sharing!',
          },
          {
            id: 3,
            user: {
              profileImageUrl: 'https://via.placeholder.com/50',
              username: 'User3',
            },
            content: 'Very informative.',
          },
        ];

        console.log('Post data:', response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    const fetchReplies = async () => {
      try {
        const accessToken = cookies.get('accessToken');
        const postId = route.params.id;
        const response = await axios.get(`${apiUrl}/api/posts/${postId}/replies`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log('Replies:', response.data);
        replies.value = response.data;
      } catch (error) {
        console.error('Error fetching replies:', error);
      }
    };

    const user = inject('user') as Ref<User>;

    const submitComment = async () => {
      console.log('Submitting comment:', newComment.value);
      if (!newComment.value.trim()) return;

      try {
        const accessToken = cookies?.get('accessToken');
        console.log('Access token:', accessToken);
        const response = await axios.post(`${apiUrl}/api/posts`, {
          content: newComment.value,
          userId: `${user.value.id}`,
          parentId: post.value.id,
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });



        replies.value.push();

        console.log('New comment:', response.data);
        newComment.value = '';
      } catch (error) {
        console.error('Error posting tweet:', error);
      }
    };

    const resizeTextarea = () => {
      if (commentTextarea.value) {
        commentTextarea.value.style.height = 'auto';
        commentTextarea.value.style.height = `${commentTextarea.value.scrollHeight}px`;
      }
    };

    onMounted(() => {
      fetchPost();
      fetchReplies();
    });

    return {
      post,
      newComment,
      submitComment,
      resizeTextarea,
      commentTextarea,
      replies,
    };
  },
});
</script>

<style scoped>
textarea {
  padding-right: 1rem; /* Adjust padding to make space for the button */
  overflow: hidden; /* Hide scrollbar */
  resize: none; /* Disable manual resizing */
}

.hover\:bg-gray-200:hover {
  background-color: #e5e7eb; /* Tailwind CSS gray-200 */
}

.hover\:animate-fade:hover {
  animation: fade 0.5s ease-in-out;
}

@keyframes fade {
  from {
    opacity: 0.5;
  }
  to {
    opacity: 1;
  }
}
</style>