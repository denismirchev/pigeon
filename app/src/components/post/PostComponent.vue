<template>
  <div
    :class="['bg-white border border-gray-200 rounded-lg p-4 mt-4', { 'hover-effect': isLink }]"
    @click="isPostClicked"
    @keydown.enter="isPostClicked"
    @keydown.space="isPostClicked"
    tabindex="0"
  >
    <!-- Original Post Content -->
    <router-link :to="`/${postRef.user.username}`" class="flex items-center space-x-4 user-info hover-darker-effect p-1 rounded-l">
      <img :src="`${$apiUrl}/uploads/pfps/${postRef.user.profileImageUrl}` || 'https://via.placeholder.com/150'" alt="Profile" class="w-10 h-10 rounded-full" />
      <div>
        <div class="font-bold">{{ postRef.user.nickname }}</div>
        <div class="text-sm text-gray-500">@{{ postRef.user.username }}</div>
      </div>
    </router-link>
    <div class="mt-4">{{ postRef.content }}</div>
    <div v-if="postRef.attachments" class="mt-4 flex space-x-4">
      <MediaPreview :media="postRef.attachments" />
    </div>

    <!-- Reposted Content, if available -->
    <div v-if="postRef.repost" class="mt-5 repost-section">
      <div class="italic text-gray-700">
        <span class="font-bold">{{ postRef.repost.user.username }}</span> reposted:
      </div>
      <div class="p-4 border border-gray-300 rounded-lg bg-gray-50 mb-4 hover-effect">
        <router-link :to="`/${postRef.repost.user.username}`" class="flex items-center space-x-4 user-info hover-darker-effect p-1 rounded-l">
          <img :src="`${$apiUrl}/uploads/pfps/${postRef.repost.user.profileImageUrl}` || 'https://via.placeholder.com/150'" alt="Profile" class="w-10 h-10 rounded-full" />
          <div>
            <div class="font-bold">{{ postRef.repost.user.nickname }}</div>
            <div class="text-sm text-gray-500">@{{ postRef.repost.user.username }}</div>
          </div>
        </router-link>
        <div class="mt-4">{{ postRef.repost.content }}</div>

        <div v-if="postRef.repost.attachments" class="mt-4 flex space-x-4">
          <MediaPreview :media="postRef.repost.attachments" />
        </div>
      </div>
    </div>

    <!-- Interaction buttons -->
    <div class="flex justify-between mt-4 text-gray-500">
      <span @click.stop>
        <img src="../../assets/icons/reply.svg" alt="Reply" class="w-5 h-5 inline-block" />
        <span class="ml-2">{{ postRef.repliesCount }}</span>
      </span>
      <span
        @click.stop="openRepostModal"
        @keydown.enter="openRepostModal"
        @keydown.space="openRepostModal"
        class="hover-repost"
        tabindex="0"
      >
        <img src="../../assets/icons/repost.svg" alt="Repost" class="w-5 h-5 inline-block" />
        <span class="ml-2">{{ postRef.repostsCount }}</span>
      </span>
      <span
        :class="{ 'text-red-500': postRef.liked }"
        @click.stop="toggleLike"
        @keydown.enter="toggleLike"
        @keydown.space="toggleLike"
        class="cursor-pointer flex items-center"
        tabindex="0"
      >
        <svg v-if="postRef.liked" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78v0z" />
        </svg>
        <span class="ml-2">{{ postRef.likesCount }}</span>
      </span>
      <span @click.stop="sharePost" @keydown.enter="sharePost" @keydown.space="sharePost" tabindex="0">
        <img src="../../assets/icons/share.svg" alt="Repost" class="w-5 h-5 inline-block" />
      </span>
    </div>

    <!-- Repost Modal -->
    <repost-modal
      v-if="showRepostModal"
      :post="postRef"
      @close="closeRepostModal"
      @repost="handleRepost"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent, PropType, ref, watch,
} from 'vue';
import { Post } from '@/types/Post';
import { likePost, unlikePost } from '@/api/post';
import router from '@/router';
import RepostModal from '@/components/post/RepostModal.vue';
import MediaPreview from '@/components/post/MediaPreview.vue';

import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

export default defineComponent({
  name: 'PostComponent',
  components: { RepostModal, MediaPreview },
  props: {
    post: { type: Object as PropType<Post>, required: true },
    isLink: { type: Boolean, default: false },
  },
  setup(props) {
    const postRef = ref(props.post);
    const showRepostModal = ref(false);

    watch(() => props.post, () => {
      postRef.value = props.post;
    });

    const toggleLike = async () => {
      if (!postRef.value.liked) {
        await likePost(postRef.value.id);
      } else {
        await unlikePost(postRef.value.id);
      }
      postRef.value.liked = !postRef.value.liked;
      postRef.value.likesCount += postRef.value.liked ? 1 : -1;
    };

    const openRepostModal = () => { showRepostModal.value = true; };
    const closeRepostModal = () => { showRepostModal.value = false; };
    const handleRepost = () => {
      postRef.value.repostsCount += 1;
      closeRepostModal();
    };

    const isPostClicked = (event: MouseEvent | KeyboardEvent) => {
      const targetElement = event.target as HTMLElement;
      if (targetElement.tagName.toLowerCase() === 'img') {
        return;
      }

      if (targetElement.closest('.user-info')) {
        // router.push(`/${props.post.user.username}`);
        return;
      }

      if (targetElement.closest('.repost-section') && props.post.repost) {
        router.push(`/${props.post.repost.user.username}/${props.post.repost.id}`);
        return;
      }

      if (props.isLink) {
        router.push(`/${props.post.user.username}/${props.post.id}`);
      }
    };

    const sharePost = async () => {
      const postLink = `${window.location.origin}/${postRef.value.user.username}/${postRef.value.id}`;
      await navigator.clipboard.writeText(postLink);
      useToast().success('Post link copied!', {
        duration: 1000,
        position: 'bottom-right',
      });
    };

    return {
      postRef,
      showRepostModal,
      toggleLike,
      openRepostModal,
      closeRepostModal,
      handleRepost,
      isPostClicked,
      sharePost,
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

.hover-effect:hover {
  background-color: #f0f0f0;
  border-color: #b0b0b0;
  transition: background-color 0.3s, border-color 0.3s;
  cursor: pointer;
}

.hover-darker-effect:hover {
  background-color: #e0e0e0;
  transition: background-color 0.3s;
}
</style>
