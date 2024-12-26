<template>
  <footer class="bg-black text-white py-4 text-center mt-4">
    <p>&copy; 2023 Your Company. All rights reserved.</p>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FooterComponent',
});
</script>

<style scoped>
footer {
  background-color: #333;
  color: #fff;
  padding: 1rem;
  text-align: center;
  margin-top: 1rem; /* Add upper margin */
}
</style>
