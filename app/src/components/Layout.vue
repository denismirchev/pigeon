<template>
  <div class="bg-gray-100 min-h-screen">
    <Header />
    <div class="container mx-auto px-4 flex flex-col lg:flex-row mt-4">
      <Sidebar />
      <main class="w-full lg:w-1/2 mb-4 lg:mb-0">
        <slot />
      </main>
      <Widgets />
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Header from '@/components/layout/Header.vue';
import Sidebar from '@/components/layout/Sidebar.vue';
import Widgets from '@/components/layout/Widgets.vue';
import Footer from "@/components/layout/Footer.vue";

export default defineComponent({
  name: 'HomePage',
  components: {
    Footer,
    Header,
    Sidebar,
    Widgets,
  },
});
</script>
