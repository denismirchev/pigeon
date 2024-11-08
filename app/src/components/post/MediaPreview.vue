<template>
  <div v-for="media in mediaPreviews" :key="media.url" class="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
    <img
      v-zoom
      v-if="media.type.startsWith('image/')"
      :src="media.url"
      alt="Media Preview"
      class="w-full h-full object-contain"
    />
    <video v-else controls class="w-full h-full object-cover">
      <source :src="media.url" type="video/mp4" />
      <track kind="captions" :src="`${media.url}.vtt`" srclang="en" label="English" default />
    </video>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'MediaPreview',
  props: {
    media: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const processMedia = (media: string) => media.split(',').map((attachment) => ({
      url: `${process.env.VUE_APP_API_URL}/uploads/attachments/${attachment}`,
      type: attachment.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg',
    }));

    const mediaPreviews = computed(() => processMedia(props.media));
    return { mediaPreviews };
  },
});
</script>
