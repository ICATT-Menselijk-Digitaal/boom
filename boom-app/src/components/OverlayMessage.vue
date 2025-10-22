<script setup lang="ts">
import SimpleSpinner from './SimpleSpinner.vue'

defineProps<{
  text: string
  useSpinner: boolean
}>()
</script>

<template>
  <div class="overlay">
    <h2>{{ text }}</h2>
    <SimpleSpinner v-if="useSpinner" />
  </div>
</template>

<style scoped>
.overlay {
  position: fixed; /* Sit on top of the page content */
  display: flex; /* Hidden by default */
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  width: 100%; /* Full width (cover the whole page) */
  height: 100%; /* Full height (cover the whole page) */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Black background with opacity */
  z-index: 2; /* Specify a stack order in case you're using a different order for other elements */
}
h2 {
  z-index: 2;
  color: white;
}
</style>
