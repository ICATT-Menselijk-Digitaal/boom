<script setup lang="ts">
import Papa from 'papaparse'
import { ref } from 'vue'

/*
 * Reference to the file input element.
 * Used to access the file input for validation and file selection.
 */
const fileInputRef = ref<HTMLInputElement | null>(null)

type CsvOutput = {
  headers: string[]
  data: Record<string, string>[]
}

/**
 * Emits events to the parent component.
 * @emits fileParsed - Emitted when the CSV file is successfully parsed.
 */
const emit = defineEmits(['fileParsed'])

/**
 * Maximum allowed file size for upload (5MB).
 * @type {number}
 */
const fileSizeLimit = 5 * 1024 * 1024 // 5MB

/**
 * Parses the selected CSV file using PapaParse.
 * Emits 'fileParsed' event with the parsed data on success.
 */
function parseFile() {
  const csvFile = fileInputRef.value?.files?.[0] as File

  Papa.parse(csvFile, {
    // Config header: if true it will parse the rows as objects of data keyed by the field name
    header: true,
    // Config complete: called when the parsing is successful and emits a 'fileParsed' event
    complete: (results) => {
      const output: CsvOutput = {
        headers: results.meta.fields || [],
        data: results.data as Record<string, string>[],
      }
      emit('fileParsed', output)
    },
    error: (error) => {
      console.error('Error parsing file:', error.message)
    },
  })
}

/**
 * Handles file input change event.
 * Validates file type and size before assigning to csvFile.
 */
function checkFile() {
  const file = fileInputRef.value?.files?.[0]
  // Check if the file input exists and has files
  if (file) {
    // Check if the file is a CSV
    if (file.type !== 'text/csv') {
      fileInputRef.value?.setCustomValidity('Please upload a valid CSV file.')
    }
    // Check if the file size exceeds 5MB
    if (file.size > fileSizeLimit) {
      fileInputRef.value?.setCustomValidity('File size exceeds 5MB limit.')
    }
  } else {
    fileInputRef.value?.setCustomValidity('Please select a file to upload.')
  }
}
</script>

<template>
  <div class="upload-component">
    <h2>Upload a CSV file</h2>
    <form @submit.prevent="parseFile">
      <div class="upload-box">
        <label for="fileUpload">Select a file to upload</label>
        <input type="file" name="fileUpload" @change="checkFile" ref="fileInputRef" accept=".csv" />
      </div>
      <button type="submit">Upload</button>
    </form>
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
