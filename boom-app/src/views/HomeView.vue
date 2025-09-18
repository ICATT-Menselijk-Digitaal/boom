<script setup lang="ts">
import { searchObject } from '@/helpers'
import TheWelcome from '../components/TheWelcome.vue'
</script>

<template>
  <main class="flex column">
    <h1>Welcome to the BOOM-app</h1>
    <TheWelcome />
    <button @click="$router.push('/upload')">Next</button>
    <button
      @click="
        searchObject(
          'http://localhost:8001/api/v1/objecttypes/feeaa795-d212-4fa2-bb38-2c34996e5702',
          2,
          { leeftijd: '66859448', kiemjaar: '85674463' },
        )
      "
    >
      Test API
    </button>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
