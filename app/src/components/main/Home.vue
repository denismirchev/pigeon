<template>
  <Layout>
    <!-- Tweet Box -->
    <div class="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-md">
      <!-- Textarea for Tweet Status -->
      <textarea
          id="status"
          placeholder="What's happening?"
          class="w-full border border-gray-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-700 resize-none"
          v-model="status"
      />

      <!-- File Upload Button -->
      <div class="mt-4 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <!-- Custom Styled Upload Button -->
          <label
              for="file-upload"
              class="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:from-green-500 hover:to-blue-600 transition-all duration-300 ease-in-out"
          >
            <input
                id="file-upload"
                type="file"
                accept=".jpg, .jpeg, .png, .gif, .mp4"
                multiple
                class="hidden"
                @change="handleFileUpload"
            />
            Upload Files
          </label>
        </div>

        <!-- Tweet Button -->
        <button
            type="button"
            class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full shadow-md transition duration-300 ease-in-out"
            @click="postTweet"
        >
          Tweet
        </button>
      </div>

      <!-- Media Preview with zoom for images -->
      <div class="mt-4 flex space-x-4" v-if="mediaPreviews.length">
        <div
            v-for="(media, index) in mediaPreviews"
            :key="index"
            class="w-32 h-32 border border-gray-300 rounded-lg overflow-hidden"
        >
          <!-- Image Preview -->
          <img
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
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>

    <!-- Render fetched posts -->
    <div v-for="post in posts" :key="post.id">
      <PostComponent :post="post" :isLink="true" />
    </div>
  </Layout>
</template>

<style scoped>
/* Optional CSS adjustments for zoomed images */
.zoomable-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; /* Ensure the image fits inside the container without cropping */
  cursor: zoom-in;
}
</style>


<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  inject,
  Ref,
  nextTick,
  onUnmounted,
} from 'vue';
import { VueCookies } from 'vue-cookies';
import Layout from '@/components/Layout.vue';
import axios from 'axios';
import { User } from "@/types/User";
import PostComponent from "@/components/main/Post.vue";
import mediumZoom from 'medium-zoom'; // Import the zoom library

export default defineComponent({
  name: 'HomePage',
  components: {
    PostComponent,
    Layout,
  },
  setup() {
    const posts = ref([] as Array<{
      id: number,
      profileImage: string,
      userName: string,
      userHandle: string,
      content: string,
      comments: number,
      retweets: number,
      likes: number,
      user: {
        id: number,
        username: string,
        email: string,
        profileImageUrl: string,
        createdAt: string,
        updatedAt: string
      },
    }>);

    const status = ref('');
    const selectedFiles = ref([] as File[]);
    const mediaPreviews = ref([] as { url: string, type: string }[]);
    const apiUrl = process.env.VUE_APP_API_URL;
    const cookies = inject<VueCookies>('$cookies');
    const user = inject('user') as Ref<User>;
    const zoomableImages = ref<HTMLImageElement[]>([]);
    let zoomInstance: any; // Variable to hold the zoom instance

    // Handle file uploads and previews
    const handleFileUpload = (event: Event) => {
      const files = (event.target as HTMLInputElement).files;
      if (files) {
        selectedFiles.value = Array.from(files);
        mediaPreviews.value = selectedFiles.value.map(file => ({
          url: URL.createObjectURL(file),
          type: file.type,
        }));

        nextTick(() => {
          if (zoomInstance) {
            zoomInstance.detach(); // Detach any previous instance to avoid multiple zoom instances
          }
          // Apply medium zoom to images after they are rendered
          zoomInstance = mediumZoom(zoomableImages.value, {
            background: 'rgba(0, 0, 0, 0.8)',
            margin: 24,
          });

          // Attach a close handler for zoom to ensure proper closure
          zoomInstance.on('closed', () => {
            document.body.style.overflow = ''; // Restore scrolling if zoom closed
          });
        });
      }
    };

    const fetchPosts = async () => {
      try {
        const accessToken = cookies?.get('accessToken');
        const response = await fetch(`${apiUrl}/api/posts`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        posts.value = data.reverse();
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    const postTweet = async () => {
      try {
        const accessToken = cookies?.get('accessToken');
        const formData = new FormData();
        formData.append('content', status.value);
        formData.append('userId', `${user.value.id}`);

        selectedFiles.value.forEach(file => {
          formData.append('media', file);
        });

        const response = await axios.post(`${apiUrl}/api/posts`, formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        // Add the new post to the beginning of the posts array
        posts.value.unshift(response.data);
        status.value = '';
        selectedFiles.value = [];
        mediaPreviews.value = [];
      } catch (error) {
        console.error('Error posting tweet:', error);
      }
    };

    onMounted(() => {
      fetchPosts();
    });

    onUnmounted(() => {
      // Cleanup the zoom instance on component unmount
      if (zoomInstance) {
        zoomInstance.detach();
      }
    });

    return {
      posts,
      status,
      postTweet,
      handleFileUpload,
      mediaPreviews,
      zoomableImages,
    };
  },
});
</script>

