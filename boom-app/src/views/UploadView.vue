<script setup lang="ts">
import type { CsvOutput } from '@/types'
import CsvUploadForm from '@/components/CsvUploadForm.vue'
import { csvData, isUploaded, selectedObjectType, selectedObjectVersion } from '@/store'
import router from '@/router'
import { ref } from 'vue'

const errorMessage = ref<string>()

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
    errorMessage.value = 'An error occured during parsing of the uploaded file.'
    if (error instanceof Error) {
      errorMessage.value = errorMessage.value.concat(error.message)
    }
  }
}
</script>

<template>
  <main class="flex column">
    <h1>Let's Upload!</h1>
    <div v-if="errorMessage" class="flex column box">
      <h2 class="error">An error occured</h2>
      <p>{{ errorMessage }}</p>
    </div>
    <CsvUploadForm v-if="!errorMessage" @fileParsed="handleFileParsed" />
    <button v-if="isUploaded && !errorMessage" @click="$router.push('/mapping')">Next</button>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
