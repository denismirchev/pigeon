<template>
  <main class="w-full lg:w-1/2 mb-4 lg:mb-0">
    <div class="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <textarea placeholder="What's happening?" class="w-full border border-gray-200 rounded-lg p-4"></textarea>
      <div class="flex justify-end mt-2">
        <button class="px-4 py-2 bg-blue-500 text-white rounded-full">Tweet</button>
      </div>
    </div>
    <!-- Example Tweet -->
    <div class="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div class="flex items-center space-x-4">
        <img src="https://via.placeholder.com/40" alt="Profile" class="w-10 h-10 rounded-full">
        <div>
          <div class="font-bold">User Name</div>
          <div class="text-sm text-gray-500">@username</div>
        </div>
      </div>
      <div class="mt-4">
        This is an example tweet. #example
      </div>
      <div class="flex justify-between mt-4 text-gray-500">
        <span>💬 10</span>
        <span>🔁 5</span>
        <span>❤️ 20</span>
        <span>📤</span>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainContent'
});
</script>
