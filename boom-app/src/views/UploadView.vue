<script setup lang="ts">
import DisplayComponent from '@/components/DisplayComponent.vue'
import UploadComponent from '../components/UploadComponent.vue'
import { ref, provide } from 'vue'

const csvData = ref<unknown[]>([])

function handleFileParsed(data: unknown[]) {
  csvData.value = data
  console.log('UploadView: File has been parsed successfully: ', csvData.value)
}

provide('csvData', csvData)
</script>

<template>
  <main>
    <h1>Here comes the upload!</h1>
    <UploadComponent class="upload-component" @fileParsed="handleFileParsed" />
    <DisplayComponent />
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
