<script setup lang="ts">
import { ref } from 'vue'
import type { CsvOutput } from '@/types'
import CsvOutputTable from '@/components/CsvOutputTable.vue'
import CsvUploadForm from '@/components/CsvUploadForm.vue'

const csvData = ref<CsvOutput>({
  headers: [],
  data: [],
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
  <main>
    <h1>Let's Upload!</h1>
    <CsvUploadForm @fileParsed="handleFileParsed" />
    <CsvOutputTable :csvData="csvData" />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
