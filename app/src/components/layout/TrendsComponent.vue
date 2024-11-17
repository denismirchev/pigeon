<template>
  <aside class="w-full lg:w-1/4 lg:pl-4">
    <div class="bg-white border border-gray-200 rounded-lg p-4">
      <h2 class="font-bold text-xl mb-2">Trends for you</h2>
      <div class="space-y-2">
        <div class="text-blue-500">#Trend1</div>
        <div class="text-blue-500">#Trend2</div>
        <div class="text-blue-500">#Trend3</div>
      </div>
    </div>
  </aside>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TrendsComponent',
});
</script>
