<script setup lang="ts">
import Papa from 'papaparse'
import { ref } from 'vue'
import type { CsvOutput, CsvRecord } from '@/types'
import { fileName } from '@/store'

const fileInputRef = ref<HTMLInputElement | null>(null)
const fileSizeLimit = 5 * 1024 * 1024 // 5MB
const isSubmitted = ref<boolean>(false)

/**
 * Emits events to the parent component.
 * @emits fileParsed - Emitted when the CSV file is successfully parsed.
 */
const emit = defineEmits(['fileParsed'])

/**
 * Show the user feedback on submission using custom validity of the input field.
 */
function submitHandler() {
  const csvFile = fileInputRef.value?.files?.[0]
  if (fileInputRef.value?.reportValidity() && csvFile instanceof File) {
    try {
      isSubmitted.value = true
      uploadFile(csvFile)
    } catch (error) {
      if (error instanceof Error) {
        console.error('Uploading file failed with the following message:', error.message)
      } else {
        console.error('Uploading error')
      }
    }
  }
}

/**
 * Set custom validity for input element.
 * Enable the submit button.
 */
function changeHandler() {
  const csvFile = fileInputRef.value?.files?.[0]
  fileInputRef.value?.setCustomValidity(fileValidationMessage(csvFile))
  isSubmitted.value = false
}

/**
 * Parses the selected CSV file.
 * Emits 'fileParsed' event on success with the parsed data.
 */
function uploadFile(csvFile: File) {
  parseFileAsync(csvFile).then((output) => {
    emit('fileParsed', output)
    fileName.value = csvFile.name
  })
}

/**
 * Parses the CSV file using PapaParse.
 * @param {File} file - The CSV file to parse.
 * @returns {Promise<CsvOutput>} - A promise that resolves with the parsed CSV data.
 */
function parseFileAsync(file: File) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        const output: CsvOutput = {
          headers: results.meta.fields || [],
          data: results.data as CsvRecord[],
        }
        resolve(output)
      },
      error: (error) => {
        reject(error)
      },
    })
  })
}

/**
 * Validates file type and size.
 * Returns an error message if the file is invalid, otherwise returns an empty string.
 * @returns {string} - Error message or empty string if valid.
 */
function fileValidationMessage(file: File | undefined): string {
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
</script>

<template>
  <div class="flex column box">
    <h2>Upload a CSV file</h2>
    <form @submit.prevent="submitHandler">
      <div class="flex column">
        <p :hidden="fileName === ''">Currently uploaded: {{ fileName }}</p>
        <label for="fileUpload">Select a file to upload</label>
        <input
          type="file"
          id="fileUpload"
          ref="fileInputRef"
          accept=".csv"
          required="true"
          @change="changeHandler"
        />
        <button :disabled="isSubmitted" type="submit">Upload</button>
      </div>
    </form>
  </div>
</template>
