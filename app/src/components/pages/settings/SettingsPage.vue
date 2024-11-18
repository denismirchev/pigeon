<template>
  <Layout>
    <div class="settings-container max-w-lg mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-6">Settings</h2>
      <form v-if="user?.id" @submit.prevent>
        <SettingsTextInputField v-model="user.name" :label="'Edit nickname'" />
        <SettingsTextInputField v-model="user.username" :label="'Edit username'" />
        <SettingsTextInputField v-model="user.email" :label="'Edit email'" />
        <SettingsTextInputField v-model="user.location" :label="'Edit location'" />
        <SettingsTextInputField v-model="user.bio" :label="'Edit bio'" />
        <SettingsTextInputField v-model="user.website" :label="'Edit website'" />
        <div class="form-group mb-4">
          <label for="profilePicture" class="block text-sm font-medium text-gray-700">Profile Picture</label>
          <div class="flex items-center">
            <input style="cursor: pointer" type="file" id="profilePicture" @change="onFileChange" accept="image/png, image/jpeg" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
            <img v-if="croppedImage" :src="croppedImage" alt="Cropped Image" class="ml-4 w-16 h-16 border border-gray-300 rounded-full shadow-md" />
            <img v-else :src="user.profileImageUrl ? `${$apiUrl}/uploads/pfps/${user.profileImageUrl}` : '/default-user-pfp.jpg'" alt="Profile Picture" class="ml-4 w-16 h-16 border border-gray-300 rounded-full shadow-md" />
          </div>
        </div>
        <button @click="submit" type="submit" class="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Save Changes</button>
      </form>
      <div v-else class="text-gray-500 text-center mt-4">Loading...</div>
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
          <button type="button" @click="closeCropperModal" class="px-4 py-2 bg-red-500 text-white rounded-md mr-2">Cancel</button>
          <button type="button" @click="confirmCrop" class="px-4 py-2 bg-green-500 text-white rounded-md">Confirm</button>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script lang="ts">
import {
  defineComponent, inject, onMounted, Ref, ref, watch,
} from 'vue';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import Layout from '@/components/Layout.vue';
import SettingsTextInputField from '@/components/pages/settings/SettingsTextInputField.vue';
import { useCookies } from 'vue3-cookies';
import { User } from '@/types/User';
import axios from 'axios';

import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'SettingsPage',
  components: { Layout, Cropper, SettingsTextInputField },
  setup() {
    const { cookies } = useCookies();
    const profilePicture = ref<File | null>(null);
    const imageSrc = ref<string | null>(null);
    const showCropperModal = ref(false);
    const croppedImage = ref<string | null>(null);

    const originalUser = inject('user') as Ref<User>;
    const user = ref<User>();
    const router = useRouter();

    const apiUrl = process.env.VUE_APP_API_URL;
    watch(originalUser, (newValue) => {
      user.value = { ...newValue };
      croppedImage.value = `${apiUrl}/uploads/pfps/${newValue.profileImageUrl}`;
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

    const closeCropperModal = () => {
      showCropperModal.value = false;
    };

    const confirmCrop = () => {
      showCropperModal.value = false;
      if (croppedImage.value) {
        fetch(croppedImage.value)
          .then((res) => res.blob())
          .then((blob) => {
            console.log('Blob:', blob);
            profilePicture.value = new File([blob], 'profile-picture.png', { type: 'image/png' });
          });
      }
    };

    const submit = async () => {
      if (!user.value) {
        return;
      }

      try {
        const accessToken = cookies.get('accessToken');
        const formData = new FormData();

        formData.append('nickname', user.value.name ?? '');
        formData.append('username', user.value.username ?? '');
        formData.append('email', user.value.email ?? '');
        formData.append('location', user.value.location ?? '');
        formData.append('bio', user.value.bio ?? '');
        formData.append('website', user.value.website ?? '');

        if (profilePicture.value) {
          formData.append('profileImageUrl', profilePicture.value);
        }

        await axios.patch(`${apiUrl}/api/users`, formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        useToast().success('User settings updated successfully!', {
          duration: 2000,
          position: 'bottom-right',
        });

        router.go(0);
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    };

    onMounted(() => {
      user.value = { ...originalUser.value };
    });

    return {
      profilePicture,
      imageSrc,
      onFileChange,
      onCropChange,
      croppedImage,
      showCropperModal,
      closeCropperModal,
      confirmCrop,
      submit,
      user,
    };
  },
});
</script>
