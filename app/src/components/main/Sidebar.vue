<template>
  <aside class="w-full lg:w-1/4 lg:pr-4 mb-4 lg:mb-0">
    <nav class="space-y-2">
      <a href="#" class="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-gray-200">
        <span class="text-xl">🏠</span>
        <span>Home</span>
      </a>
      <a href="#" class="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-gray-200">
        <span class="text-xl">🔍</span>
        <span>Explore</span>
      </a>
      <a href="#" class="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-gray-200">
        <span class="text-xl">🔔</span>
        <span>Notifications</span>
      </a>
      <a href="#" class="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-gray-200">
        <span class="text-xl">✉️</span>
        <span>Messages</span>
      </a>
    </nav>
  </aside>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Sidebar'
});
</script>
