<template>
  <div :class="['bg-white border border-gray-200 rounded-lg p-4 mt-4', { 'hover-effect': isLink }]" @click="isClicked">    <!-- Original Post Content -->
    <div class="flex items-center space-x-4">
      <img :src="post.user.profileImageUrl || 'https://via.placeholder.com/150'" alt="Profile" class="w-10 h-10 rounded-full" />
      <div>
        <div class="font-bold">{{ post.user.username }}</div>
        <div class="text-sm text-gray-500">{{ post.userHandle }}</div>
      </div>
    </div>
    <div class="mt-4">{{ post.content }}</div>

    <!-- Media Previews for original post -->
    <div class="mt-4 flex space-x-4" v-if="mediaPreviews.length">
      <div
        v-for="(media, index) in mediaPreviews"
        :key="index"
        class="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden"
      >
        <img
            v-zoom
            v-if="media.type.startsWith('image/')"
            :src="media.url"
            alt="Media Preview"
            class="w-full h-full object-contain"
        />
        <video v-else controls class="w-full h-full object-cover">
          <source :src="media.url" type="video/mp4" />
        </video>
      </div>
    </div>

    <!-- Reposted Content, if available -->
    <div v-if="post.repostedPost" class="mt-5">
      <div class="italic text-gray-700">
        <span class="font-bold">{{ post.repostedPost.user.username }}</span> reposted:
      </div>
      <router-link :to="`/${post.repostedPost.user.username}/${post.repostedPost.id}`" class="no-underline ">
        <div class="p-4 border border-gray-300 rounded-lg bg-gray-50 mb-4 hover-effect">
          <div class="text-sm text-gray-500">@{{ post.repostedPost.user.username }}</div>
          <div class="mt-4">{{ post.repostedPost.content }}</div>

          <!-- Media Previews for reposted content -->
          <div class="mt-4 flex space-x-4" v-if="repostedMediaPreviews.length">
            <div
              v-for="(media, index) in repostedMediaPreviews"
              :key="index"
              class="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden"
            >
              <!-- Image Preview -->
              <img
                v-if="media.type.startsWith('image/')"
                :src="media.url"
                alt="Media Preview"
                class="w-full h-full object-contain"
              />
              <!-- Video Preview -->
              <video v-else controls class="w-full h-full object-cover" @click.stop>
                <source :src="media.url" type="video/mp4" />
                <track kind="captions" srclang="en" label="English captions" />
              </video>
            </div>
          </div>
        </div>
      </router-link>
    </div>

    <!-- Interaction buttons -->
    <div class="flex justify-between mt-4 text-gray-500">
      <span @click.stop>
        <img src="@/assets/icons/reply.svg" alt="Reply" class="w-5 h-5 inline-block" />
        <span class="ml-2">{{ post.repliesCount }}</span>
      </span>
        <span @click.stop="openRepostModal" class="hover-repost">
        <img src="@/assets/icons/repost.svg" alt="Repost" class="w-5 h-5 inline-block" />
        <span class="ml-2">{{ post.repostsCount }}</span>
      </span>
        <span :class="{ 'text-red-500': liked, 'animate-like': likedAnimation }" @click.stop="toggleLike" class="cursor-pointer flex items-center">
        <svg v-if="liked" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78v0z" />
        </svg>
        <span class="ml-2">{{ likesCount }}</span>
      </span>
      <span @click.stop>📤</span>
    </div>

    <!-- Repost Modal -->
    <repost-modal v-if="showRepostModal" :post="post" @close="closeRepostModal" @repost="handleRepost" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';
import { Post } from "@/types/Post";
import { likePost, unlikePost } from "@/api/post";
import RepostModal from './RepostModal.vue';
import {isLiteral} from "@rushstack/eslint-patch/lib/eslint-bulk-suppressions/ast-guards";
import router from "@/router";

export default defineComponent({
  name: 'PostComponent',
  methods: {isLiteral},
  components: { RepostModal },
  props: {
    post: { type: Object as PropType<Post>, required: true },
    isLink: { type: Boolean, default: false },
  },
  setup(props) {
    const liked = ref(props.post.liked);
    const likesCount = ref(props.post.likesCount);
    const repostedMediaPreviews = ref<any[]>([]);
    const mediaPreviews = ref<any[]>([]);
    const showRepostModal = ref(false);

    const attachments = ref(props.post.attachments?.split(','));
    const repostedAttachments = ref(props.post.repostedPost?.attachments?.split(','));

    const apiUrl = process.env.VUE_APP_API_URL;

    mediaPreviews.value = attachments.value?.map((attachment) => ({
      url: `${apiUrl}/uploads/${attachment}`,
      type: attachment.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg',
    })) || [];

    repostedMediaPreviews.value = repostedAttachments.value?.map((attachment) => ({
      url: `${apiUrl}/uploads/${attachment}`,
      type: attachment.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg',
    })) || [];

    const toggleLike = () => {
      if (liked.value) {
        unlikePost(props.post.id);
        likesCount.value -= 1;
      } else {
        likePost(props.post.id);
        likesCount.value += 1;
      }
      liked.value = !liked.value;
    };

    const openRepostModal = () => {
      showRepostModal.value = true;
    };

    const closeRepostModal = () => {
      showRepostModal.value = false;
    };

    const handleRepost = (post: Post) => {
      console.log('Repost with quote:', post);
      closeRepostModal();
    };

    watch(() => props.post, () => {
      liked.value = props.post.liked;
      likesCount.value = props.post.likesCount;
      attachments.value = props.post.attachments?.split(',');
      repostedAttachments.value = props.post.repostedPost?.attachments?.split(',');
    });

    const isClicked = (event: MouseEvent) => {
      if ((event.target as HTMLElement).tagName.toLowerCase() === 'img') {
        return;
      }

      // redirect to the post page
      if (props.isLink) {
        router.push(`/${props.post.user.username}/${props.post.id}`);
      }
    };

    return {
      liked,
      likesCount,
      toggleLike,
      mediaPreviews,
      repostedMediaPreviews,
      showRepostModal,
      openRepostModal,
      closeRepostModal,
      handleRepost,
      isClicked,
    };
  },
});
</script>

<style scoped>
.hover-repost:hover {
  transform: scale(1.1);
  transition: transform 0.3s ease-in-out;
  cursor: pointer;
}

@keyframes like-bounce {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.animate-like {
  animation: like-bounce 0.5s ease;
}

.hover-effect:hover {
  background-color: #f0f0f0;
  border-color: #b0b0b0;
  transition: background-color 0.3s, border-color 0.3s;
  cursor: pointer;
}

</style>
