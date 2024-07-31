<template>
  <header class="bg-white border-b border-gray-200">
    <div class="container mx-auto px-4 py-2 flex justify-between items-center">
      <div class="text-xl font-bold text-blue-500">Pigeon</div>
      <div class="hidden sm:flex items-center space-x-4">
        <input type="text" placeholder="Search Pigeon" class="px-4 py-2 rounded-full border border-gray-300 flex-grow">
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Header'
});
</script>