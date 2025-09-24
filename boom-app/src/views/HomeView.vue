<script setup lang="ts">
import { convertDataToObjects, createNewObject } from '@/helpers'
import TheWelcome from '../components/TheWelcome.vue'
import { csvData, mapping, selectedObjectVersion } from '@/store'
</script>

<template>
  <main class="flex column">
    <h1>Welcome to the BOOM-app</h1>
    <TheWelcome />
    <button @click="$router.push('/upload')">Next</button>
    <button
      @click="
        createNewObject(selectedObjectVersion?.objectType ?? '',
          selectedObjectVersion?.version ?? 0,
          convertDataToObjects(csvData, mapping).at(0) ?? {},
        ).then((res) => console.log(res.json()))
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
