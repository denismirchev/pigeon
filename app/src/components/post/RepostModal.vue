<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 cursor-auto" @click="close" @keydown.enter="close" @keydown.space="close" tabindex="0">
    <div class="bg-white rounded-lg p-4 w-96 relative" @click.stop tabindex="0">
      <button @click="close" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl" type="button">
        &times;
      </button>
      <h3 class="font-bold text-lg mb-2">Repost</h3>
      <tweet-box v-model="quote" :repost-id="post.id" @tweetPosted="repostSuccess" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue';
import { Post } from '@/types/Post';
import TweetBox from '@/components/post/TweetBox.vue';

import { useToast } from 'vue-toast-notification';

export default defineComponent({
  name: 'RepostModal',
  components: { TweetBox },
  props: {
    post: { type: Object as PropType<Post>, required: true },
  },
  emits: ['close', 'repost'],
  setup(_, { emit }) {
    const quote = ref('');

    const close = () => {
      emit('close');
    };

    const repostSuccess = (post: Post) => {
      useToast().success('Repost successful!', {
        duration: 2000,
        position: 'bottom-right',
      });
      emit('repost', post);
    };

    return {
      quote,
      close,
      repostSuccess,
    };
  },
});
</script>
