<template>
  <!-- Textarea for Post Content -->
  <textarea
    id="content"
    :placeholder="parentId ? 'Reply...' : 'What\'s happening?'"
    class="w-full border border-gray-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-700 resize-none"
    v-model="content"
  />

  <!-- File Upload Button -->
  <div class="mt-4 flex items-center justify-between">
    <div class="flex items-center space-x-4">
      <!-- Custom Styled Upload Button -->
      <label
        :for="fileInputId"
        class="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:from-green-500 hover:to-blue-600 transition-all duration-300 ease-in-out"
      >
        <input :id="fileInputId" type="file" accept=".jpg, .jpeg, .png, .gif, .mp4" multiple class="hidden" @change="handleFileUpload" />
        Upload Files
      </label>
    </div>

    <!-- Tweet Button -->
    <button
      type="button"
      class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full shadow-md transition duration-300 ease-in-out"
      @click="postTweet"
    >
      {{ parentId ? 'Reply' : 'Post' }}
    </button>
  </div>

  <!-- Media Preview with zoom for images -->
  <div class="mt-4 flex space-x-4" v-if="mediaPreviews.length">
    <div
      v-for="(media, index) in mediaPreviews"
      :key="index"
      class="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden"
    >
      <!-- Remove Button -->
      <button
        type="button"
        class="absolute top-0 right-0 bg-red-500 text-white text-2xl rounded-full w-6 h-6 flex items-center justify-center"
        @click="removeFile(index)"
      >
        &times;
      </button>
      <!-- Image Preview -->
      <img
        v-zoom
        v-if="media.type.startsWith('image/')"
        :src="media.url"
        alt="Media Preview"
        class="w-full h-full object-contain zoomable-image"
        ref="zoomableImages"
      />
      <!-- Video Preview -->
      <video
        v-else
        controls
        class="w-full h-full object-cover"
      >
        <source :src="media.url" type="video/mp4" />
        <track kind="captions" srclang="en" label="English captions" src="" />
        Your browser does not support the video tag.
      </video>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  inject,
  Ref,
} from 'vue';
import { User } from '@/types/User';
import { createPost } from '@/api/post';
import { useToast } from 'vue-toast-notification';

export default defineComponent({
  name: 'TweetBox',
  props: {
    parentId: { type: Number, default: null },
    repostId: { type: Number, default: null },
  },
  emits: ['tweetPosted'],
  setup(props, { emit }) {
    const content = ref('');
    const user = inject('user') as Ref<User>;

    const selectedFiles = ref<File[]>([]);
    const mediaPreviews = ref<{ url: string, type: string }[]>([]);

    // Generate a unique ID for each instance
    const fileInputId = `file-upload-${Math.random().toString(36).substring(2, 9)}`;

    const postTweet = async () => {
      try {
        const response = await createPost(
          content.value,
          user.value.id,
          props.parentId,
          props.repostId,
          selectedFiles.value,
        );

        emit('tweetPosted', response);
        content.value = '';
        selectedFiles.value = [];
        mediaPreviews.value = [];
      } catch (error) {
        console.error('Error posting tweet:', error);
      }
    };

    const handleFileUpload = (event: Event) => {
      const { files } = (event.target as HTMLInputElement);
      if (files) {
        const newFiles = Array.from(files);
        if (selectedFiles.value.length + newFiles.length > 4) {
          useToast().error('You can only upload up to 4 files at a time.', {
            duration: 4000,
            position: 'bottom-right',
          });
          return;
        }
        selectedFiles.value = selectedFiles.value.concat(newFiles);
        mediaPreviews.value = selectedFiles.value.map((file) => ({
          url: URL.createObjectURL(file),
          type: file.type,
        }));
      }
    };

    const removeFile = (index: number) => {
      selectedFiles.value.splice(index, 1);
      mediaPreviews.value.splice(index, 1);
    };

    return {
      content,
      mediaPreviews,
      postTweet,
      handleFileUpload,
      removeFile,
      fileInputId,
    };
  },
});
</script>
