<template>
  <div class="bg-gray-100 min-h-screen">
    <Header />
    <div class="container mx-auto px-4 flex flex-col lg:flex-row mt-4">
      <Sidebar />
      <MainContent />
      <Widgets />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Header from "@/components/main/Header.vue";
import Sidebar from "@/components/main/Sidebar.vue";
import MainContent from "@/components/main/MainContent.vue";
import Widgets from "@/components/main/Widgets.vue";

export default defineComponent({
  name: 'HomePage',
  components: {
    Header,
    Sidebar,
    MainContent,
    Widgets
  }
});
</script>