<script setup lang="ts">
import Papa from 'papaparse'

// TEMP variable to hold the file
let csvFile: File

const emit = defineEmits(['fileParsed'])
const fileSizeLimit = 5 * 1024 * 1024 // 5MB

function parseFile() {
  Papa.parse(csvFile, {
    header: true,
    complete: (results) => {
      console.log('Parsed Results:', results)
      // Emit event to notify parent component
      emit('fileParsed', results.data)
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
      fileInputValidityHelper('Please upload a valid CSV file.', fileInput)
      return
    }
    // Check if the file size exceeds 5MB
    if (file.size > fileSizeLimit) {
      fileInputValidityHelper('File size exceeds 5MB limit.', fileInput)
      return
    }
    csvFile = file
  } else {
    fileInputValidityHelper('Please select a file to upload.', fileInput)
  }
}

function fileInputValidityHelper(msg: string, fileInput: HTMLInputElement) {
  fileInput.setCustomValidity(msg)
  fileInput.reportValidity()
  fileInput.value = '' // Clear the input
}
</script>

<template>
  <div class="upload-component">
    <h2>Upload a CSV file</h2>
    <div class="upload-box">
      <input type="file" id="upload-field" @change="checkFileHandler" accept=".csv" />
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
</style>
