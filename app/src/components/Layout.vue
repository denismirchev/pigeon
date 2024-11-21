<template>
  <div class="bg-gray-100 min-h-screen">
    <div class="container mx-auto px-4 flex flex-col lg:flex-row pt-4">
      <SidebarComponent />
      <main class="w-full lg:w-1/2 mb-4 lg:mb-0 pb-4">
        <slot />
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SidebarComponent from '@/components/layout/SidebarComponent.vue';

export default defineComponent({
  name: 'HomePage',
  components: {
    SidebarComponent,
  },
});
</script>
