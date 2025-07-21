<script setup lang="ts">
import Papa from 'papaparse'
import { ref } from 'vue'

const fileErrorMsg = ref('')
let csvFile: File

const emit = defineEmits(['fileParsed'])
const fileSizeLimit = 5 * 1024 * 1024 // 5MB

function parseFile() {
  Papa.parse(csvFile, {
    header: true,
    complete: (results) => {
      console.log('Parsed Results:', results)
      emit('fileParsed')
    },
    error: (error) => {
      console.error('Error parsing file:', error)
    },
  })
}

function checkFileHandler() {
  const fileInput = document.getElementById('upload-field') as HTMLInputElement

  // Check if the file input exists and has files
  if (fileInput && fileInput.files && fileInput.files[0]) {
    const file = fileInput.files[0]

    // Check if the file is a CSV
    if (file.type !== 'text/csv') {
      console.error('Please upload a valid CSV file.')
      fileErrorMsg.value = 'Please upload a valid CSV file.'
      return
    }
    // Check if the file size exceeds 5MB
    if (file.size > fileSizeLimit) {
      console.error('File size exceeds the limit of 5MB.')
      fileErrorMsg.value = 'File size exceeds the limit of 5MB.'
      return
    }
    fileErrorMsg.value = ''
    csvFile = file
  } else {
    console.error('No file selected or file input not found.')
    fileErrorMsg.value = 'No file selected or file input not found.'
  }
}
</script>

<template>
  <div class="upload-component">
    <h2>Upload a CSV file</h2>
    <div class="upload-box">
      <input type="file" id="upload-field" @change="checkFileHandler" accept=".csv" />
      <p class="warning-message">{{ fileErrorMsg }}</p>
    </div>
    <button @click="parseFile">Upload</button>
  </div>
</template>

<style scoped>
.upload-box {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  margin-top: 10px;
}

.warning-message {
  color: red;
  font-size: 0.9em;
}
</style>
