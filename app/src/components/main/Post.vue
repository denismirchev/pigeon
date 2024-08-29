<template>
  <div class="bg-white border border-gray-200 rounded-lg p-4 mt-4">
    <div v-if="isLink">
      <router-link :to="`/${post.user.username}/${post.id}`" class="block hover:bg-gray-200">
        <div class="flex items-center space-x-4">
          <img :src="post.user.profileImageUrl || 'https://via.placeholder.com/150'" alt="Profile" class="w-10 h-10 rounded-full" />
          <div>
            <div class="font-bold">{{ post.user.username }}</div>
            <div class="text-sm text-gray-500">{{ post.userHandle }}</div>
          </div>
        </div>
        <div class="mt-4">{{ post.content }}</div>
      </router-link>
    </div>
    <div v-else>
      <div class="flex items-center space-x-4">
        <img :src="post.user.profileImageUrl || 'https://via.placeholder.com/150'" alt="Profile" class="w-10 h-10 rounded-full" />
        <div>
          <div class="font-bold">{{ post.user.username }}</div>
          <div class="text-sm text-gray-500">{{ post.userHandle }}</div>
        </div>
      </div>
      <div class="mt-4">{{ post.content }}</div>
    </div>
    <div class="flex justify-between mt-4 text-gray-500">
      <span @click.stop>
        <img src="@/assets/icons/reply.svg" alt="Reply" class="w-5 h-5 inline-block" />
        <span class="ml-2">{{ post.repliesCount }}</span>
      </span>
      <span @click.stop>
        <img src="@/assets/icons/repost.svg" alt="Repost" class="w-5 h-5 inline-block" />
        <span class="ml-2">0</span>
      </span>
      <span
          :class="{'text-red-500': liked, 'animate-like': likedAnimation}"
          @click.stop="toggleLike"
          class="cursor-pointer flex items-center"
      >
        <svg
            v-if="liked"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-5 h-5"
        >
          <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        </svg>
        <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            class="w-5 h-5"
        >
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78v0z"
          />
        </svg>
        <span class="ml-2">{{ likesCount }}</span>
      </span>
      <span @click.stop>📤</span>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType, ref, watch} from 'vue';
import { Post } from "@/types/Post";
import {likePost, unlikePost} from "@/api/post";

export default defineComponent({
  name: 'PostComponent',
  props: {
    post: { type: Object as PropType<Post>, required: true },
    isLink: { type: Boolean, default: false },
  },
  setup(props) {
    // if (!props.)
    const liked = ref(props.post.liked);
    const likesCount = ref(props.post.likesCount);
    const likedAnimation = ref(false);

    watch(() => props.post, () => {
      liked.value = props.post.liked;
      likesCount.value = props.post.likesCount;
    });

    const toggleLike = () => {
      if (liked.value) {
        unlikePost(props.post.id);
        likesCount.value -= 1;
      } else {
        likePost(props.post.id);
        likesCount.value += 1;
      }

      liked.value = !liked.value;

      // Trigger animation
      likedAnimation.value = true;
      setTimeout(() => {
        likedAnimation.value = false;
      }, 500); // Duration of the animation in ms
    };

    return {
      liked,
      likesCount,
      likedAnimation,
      toggleLike,
    };
  },
});
</script>

<style scoped>
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
</style>
