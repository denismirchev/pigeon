<template>
  <header class="bg-white border-b border-gray-200">
    <div class="container mx-auto px-4 py-2 flex justify-between items-center">
      <div class="flex items-center space-x-2">
        <img :src="icon" alt="Pigeon Icon" class="w-10 h-10 transform scale-100 text-blue-500" />
        <div class="text-xl font-bold text-blue-500">Pigeon</div>
      </div>
      <div class="hidden sm:flex items-center space-x-4">
        <input type="text" placeholder="Search Pigeon" class="px-4 py-2 rounded-full border border-gray-300 flex-grow">
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import icon from '../../../public/logo.svg';

export default defineComponent({
  name: 'HeaderComponent',
  data() {
    return {
      icon,
    };
  },
});
</script>

<style scoped>
img {
  filter: invert(29%) sepia(83%) saturate(748%) hue-rotate(183deg) brightness(95%) contrast(101%);
}
</style>