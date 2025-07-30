<script setup lang="ts">
import Papa from 'papaparse'
import { ref } from 'vue'
import type { CsvOutput } from '@/types'

const fileInputRef = ref<HTMLInputElement | null>(null)
const fileSizeLimit = 5 * 1024 * 1024 // 5MB

/**
 * Emits events to the parent component.
 * @emits fileParsed - Emitted when the CSV file is successfully parsed.
 */
const emit = defineEmits(['fileParsed'])

/**
 * Parses the selected CSV file using PapaParse.
 * Emits 'fileParsed' event on success with the parsed data.
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
 * Validates file type and size.
 * Returns an error message if the file is invalid, otherwise returns an empty string.
 * @returns {string} - Error message or empty string if valid.
 */
function isUploadedFileValid() {
  const file = fileInputRef.value?.files?.[0]
  // Check if the file input exists and has files
  if (file) {
    // Check if the file is a CSV
    if (file.type !== 'text/csv') {
      return 'Please upload a valid CSV file.'
    }
    // Check if the file size exceeds size limit
    if (file.size > fileSizeLimit) {
      return 'File size exceeds 5MB limit.'
    }
  } else {
    return 'Please select a file to upload.'
  }
  return '' // Valid file
}

/**
 * Checks the uploaded file and sets custom validity based on validation results.
 */
function checkUploadedFile() {
  fileInputRef.value?.setCustomValidity(isUploadedFileValid())
}
</script>

<template>
  <h2>Upload a CSV file</h2>
  <form @submit.prevent="parseFile">
    <div class="upload-box">
      <label for="fileUpload">Select a file to upload</label>
      <input
        type="file"
        name="fileUpload"
        @change="checkUploadedFile"
        ref="fileInputRef"
        accept=".csv"
      />
    </div>
    <button type="submit">Upload</button>
  </form>
</template>

<style scoped>
.upload-box {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  margin-top: 10px;
}
</style>
