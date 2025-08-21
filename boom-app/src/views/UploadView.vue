<script setup lang="ts">
import type { CsvOutput } from '@/types'
import CsvOutputTable from '@/components/CsvOutputTable.vue'
import CsvUploadForm from '@/components/CsvUploadForm.vue'
import { csvData } from '@/store'
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
}
</script>

<template>
  <main class="flex column">
    <h1>Let's Upload!</h1>
    <CsvUploadForm @fileParsed="handleFileParsed" />
    <CsvOutputTable v-if="isNext" :csvData="csvData" />
    <button v-if="isNext" @click="$router.push('/mapping')">Next</button>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
