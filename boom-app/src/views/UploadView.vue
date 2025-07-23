<script setup lang="ts">
import DisplayComponent from '@/components/DisplayComponent.vue'
import UploadComponent from '../components/UploadComponent.vue'
import { ref } from 'vue'

type CsvOutput = {
  headers: string[]
  data: Record<string, string>[]
}

const csvData = ref<CsvOutput>({
  headers: [],
  data: [],
})

/**
 * Saves the 'fileParsed' event emitted by the UploadComponent.
 * @param {CsvOutput} receivedData - The parsed CSV data.
 */
function handleFileParsed(receivedData: CsvOutput) {
  csvData.value = receivedData
}
</script>

<template>
  <main>
    <h1>Here comes the upload!</h1>
    <UploadComponent class="upload-component" @fileParsed="handleFileParsed" />
    <DisplayComponent :csvData="csvData" />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
.upload-component {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
</style>
