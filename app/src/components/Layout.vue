<template>
  <div class="bg-gray-100 min-h-screen">
    <HeaderComponent />
    <div class="container mx-auto px-4 flex flex-col lg:flex-row mt-4">
      <SidebarComponent />
      <main class="w-full lg:w-1/2 mb-4 lg:mb-0">
        <slot />
      </main>
      <TrendsComponent />
    </div>
    <FooterComponent />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HeaderComponent from '@/components/layout/HeaderComponent.vue';
import SidebarComponent from '@/components/layout/SidebarComponent.vue';
import TrendsComponent from '@/components/layout/TrendsComponent.vue';
import FooterComponent from '@/components/layout/FooterComponent.vue';

export default defineComponent({
  name: 'HomePage',
  components: {
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    TrendsComponent,
  },
});
</script>
