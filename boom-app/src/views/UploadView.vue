<script setup lang="ts">
import type { CsvOutput } from '@/types'
import CsvUploadForm from '@/components/CsvUploadForm.vue'
import { csvData, isUploaded, selectedObjectType, selectedObjectVersion } from '@/store'
import router from '@/router'

/**
 * Handles the 'fileParsed' event:
 * - fetches the ObjectTypes meta data
 * - saves the CsvOutput data to pass that to the DisplayComponent.
 * - routes to /mapping
 * @param {CsvOutput} receivedData - The parsed CSV data.
 */
async function handleFileParsed(receivedData: CsvOutput) {
  try {
    csvData.value = receivedData
    // Required for a reset when a new file is uploaded mid mapping.
    selectedObjectType.value = undefined
    selectedObjectVersion.value = undefined
    router.push('/mapping')
  } catch (error) {
    // temporary console error logging. Replace with presenting error to user
    console.log(error)
  }
}
</script>

<template>
  <main class="flex column">
    <h1>Let's Upload!</h1>
    <CsvUploadForm @fileParsed="handleFileParsed" />
    <button v-if="isUploaded" @click="$router.push('/mapping')">Next</button>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
