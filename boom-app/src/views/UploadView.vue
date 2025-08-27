<script setup lang="ts">
import type { CsvOutput } from '@/types'
import CsvUploadForm from '@/components/CsvUploadForm.vue'
import { csvData } from '@/store'
import router from '@/router'
import { computed } from 'vue'

const isNext = computed<boolean>(() => {
  return csvData.value.headers.length > 0
})

/**
 * Handles the 'fileParsed' event and saves the CsvOutput data to pass that to the DisplayComponent.
 * @param {CsvOutput} receivedData - The parsed CSV data.
 */
function handleFileParsed(receivedData: CsvOutput) {
  csvData.value = receivedData
  router.push('/mapping')
}
</script>

<template>
  <main class="flex column">
    <h1>Let's Upload!</h1>
    <CsvUploadForm @fileParsed="handleFileParsed" />
    <button v-if="isNext" @click="$router.push('/mapping')">Next</button>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
