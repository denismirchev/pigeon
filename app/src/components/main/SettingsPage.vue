<template>
  <Layout>
    <div class="settings-container max-w-lg mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <!-- Other form fields here -->
      <div class="form-group mb-4">
        <label for="profilePicture" class="block text-sm font-medium text-gray-700">Profile Picture</label>
        <input type="file" id="profilePicture" @change="onFileChange" />
        <div v-if="imageSrc">
          <h1 class="text-lg font-semibold mt-4">Crop the image</h1>
          <cropper
            :src="imageSrc"
            :stencil-props="{
              aspectRatio: 1,
            }"
            @change="onCropChange"
            :minWidth="100"
          />
        </div>
      </div>
    </div>
    <img :src="croppedImage" alt="Cropped Image" v-if="croppedImage" />
  </Layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import Layout from '@/components/Layout.vue';
import { useCookies } from 'vue3-cookies';

export default defineComponent({
  name: 'SettingsPage',
  components: { Layout, Cropper },
  setup() {
    const { cookies } = useCookies();
    const username = ref('');
    const nickname = ref('');
    const profilePicture = ref<File | null>(null);
    const imageSrc = ref<string | null>(null);

    const onFileChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          imageSrc.value = e.target?.result as string;
        };
        reader.readAsDataURL(target.files[0]);
      }
    };

    const croppedImage = ref<string | null>(null);

    const onCropChange = (cropData: any) => {
      const { canvas } = cropData;
      if (canvas) {
        canvas.toBlob((blob: Blob | null) => {
          if (blob) {
            croppedImage.value = URL.createObjectURL(blob);
          }
        });
      }
    };

    return {
      username,
      nickname,
      profilePicture,
      imageSrc,
      onFileChange,
      onCropChange,
      croppedImage,
    };
  },
});
</script>
