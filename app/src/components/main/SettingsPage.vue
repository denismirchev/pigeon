<template>
  <Layout>
    <div class="settings-container max-w-lg mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-6">Settings</h2>
      <form @submit.prevent="updateSettings">
        <div class="form-group mb-4">
          <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
          <div class="relative">
            <input
                type="text"
                id="username"
                v-model="username"
                :readonly="!isEditingUsername"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
              <i
                  v-if="!isEditingUsername"
                  class="fas fa-edit cursor-pointer text-gray-500"
                  @click="editUsername"
              ></i>
              <i
                  v-else
                  class="fas fa-check cursor-pointer text-green-500"
                  @click="submitUsername"
              ></i>
              <i
                  v-else
                  class="fas fa-times cursor-pointer text-red-500 ml-2"
                  @click="cancelEditUsername"
              ></i>
            </div>
          </div>
        </div>
        <div class="form-group mb-4">
          <label for="nickname" class="block text-sm font-medium text-gray-700">Nickname</label>
          <div class="relative">
            <input
                type="text"
                id="nickname"
                v-model="nickname"
                :readonly="!isEditingNickname"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
              <i
                  v-if="!isEditingNickname"
                  class="fas fa-edit cursor-pointer text-gray-500"
                  @click="isEditingNickname = true"
              ></i>
              <i
                  v-else
                  class="fas fa-check cursor-pointer text-green-500"
                  @click="submitNickname"
              ></i>
              <i
                  v-else
                  class="fas fa-times cursor-pointer text-red-500 ml-2"
                  @click="cancelEditNickname"
              ></i>
            </div>
          </div>
        </div>
        <div class="form-group mb-4">
          <label for="profilePicture" class="block text-sm font-medium text-gray-700">Profile Picture</label>
          <div class="flex items-center">
            <input style="cursor: pointer" type="file" id="profilePicture" @change="onFileChange" accept="image/png, image/jpeg" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
            <img v-if="croppedImage" :src="croppedImage" alt="Cropped Image" class="ml-4 w-16 h-16 border border-gray-300 rounded-full shadow-md" />
          </div>
        </div>
        <button @click="submit" type="submit" class="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Save Changes</button>
      </form>
    </div>

    <!-- Modal for Image Cropper -->
    <div v-if="showCropperModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h1 class="text-lg font-semibold">Crop the image</h1>
        <cropper
          :src="imageSrc"
          :stencil-props="{ aspectRatio: 1 }"
          @change="onCropChange"
          :minWidth="100"
        />
        <div class="mt-4 flex justify-end">
          <button @click="closeCropperModal" class="px-4 py-2 bg-red-500 text-white rounded-md mr-2">Cancel</button>
          <button @click="confirmCrop" class="px-4 py-2 bg-green-500 text-white rounded-md">Confirm</button>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script lang="ts">
import {defineComponent, inject, Ref, ref, watch} from 'vue';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import Layout from '@/components/Layout.vue';
import { useCookies } from 'vue3-cookies';
import {User} from "@/types/User";
import axios from "axios";

export default defineComponent({
  name: 'SettingsPage',
  components: { Layout, Cropper },
  setup() {
    const { cookies } = useCookies();
    const originalUsername = ref('ff');
    const username = ref(originalUsername.value);
    const nickname = ref('');
    const profilePicture = ref<File | null>(null);
    const imageSrc = ref<string | null>(null);
    const isEditingUsername = ref(false);
    const isEditingNickname = ref(false);
    const showCropperModal = ref(false);

    const user = inject('user') as Ref<User>;
    watch(user, (newValue) => {
      originalUsername.value = newValue.username;
      username.value = newValue.username;
      nickname.value = newValue.name;
    });



    const onFileChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          imageSrc.value = e.target?.result as string;
          showCropperModal.value = true;
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

    const editUsername = () => {
      isEditingUsername.value = true;
    };

    const submitUsername = () => {
      isEditingUsername.value = false;
      // Add logic to submit the updated username
    };

    const cancelEditUsername = () => {
      isEditingUsername.value = false;
      username.value = originalUsername.value;
    };

    const submitNickname = () => {
      isEditingNickname.value = false;
      // Add logic to submit the updated nickname
    };

    const cancelEditNickname = () => {
      isEditingNickname.value = false;
      // Add logic to revert the nickname changes if needed
    };

    const closeCropperModal = () => {
      showCropperModal.value = false;
    };

    const confirmCrop = () => {
      showCropperModal.value = false;
      // Add logic to handle the cropped image
    };

    const apiUrl = process.env.VUE_APP_API_URL;

    const submit = async () => {
      try {
        const accessToken = cookies.get('accessToken');

        const formData = new FormData();
        if (croppedImage.value) {
          formData.append('profilePicture', croppedImage.value);
        }

        const response = await axios.patch(`${apiUrl}/api/users`, formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('Settings updated:', response.data);
        // Add logic to submit the form data
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    };

    return {
      username,
      nickname,
      profilePicture,
      imageSrc,
      onFileChange,
      onCropChange,
      isEditingUsername,
      isEditingNickname,
      editUsername,
      submitUsername,
      cancelEditUsername,
      submitNickname,
      cancelEditNickname,
      croppedImage,
      showCropperModal,
      closeCropperModal,
      confirmCrop,
      submit,
    };
  },
});
</script>