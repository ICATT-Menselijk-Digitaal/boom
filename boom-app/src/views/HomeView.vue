<script setup lang="ts">
import { fetchObjectTypes } from '@/helpers'
import TheWelcome from '../components/TheWelcome.vue'
fetchObjectTypes()
</script>

<template>
  <main class="flex column">
    <h1>Welcome to the BOOM-app</h1>
    <TheWelcome />
    <button @click="$router.push('/upload')">Next</button>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
