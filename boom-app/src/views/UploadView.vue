<script setup lang="ts">
import type { CsvOutput, ObjectTypeMetaData, PaginatedObjectTypeList } from '@/types'
import CsvUploadForm from '@/components/CsvUploadForm.vue'
import { csvData, isUploaded, objectTypesMetaDataList } from '@/store'
import router from '@/router'
// import { fetchObjectTypeData } from '@/helpers'

/**
 * Handles the 'fileParsed' event:
 * - fetches the ObjectTypes meta data
 * - saves the CsvOutput data to pass that to the DisplayComponent.
 * - routes to /mapping
 * @param {CsvOutput} receivedData - The parsed CSV data.
 */
async function handleFileParsed(receivedData: CsvOutput) {
  try {
    objectTypesMetaDataList.value = await fetchObjectTypes()
    csvData.value = receivedData
    router.push('/mapping')
  } catch (error) {
    // temporary console error logging. Replace with presenting error to user
    console.log(error)
  }
}

/**
 * Fetches the list of ObjectTypes from the API
 * @returns A Promise that is a list of ObjectType meta data
 */
async function fetchObjectTypes(): Promise<ObjectTypeMetaData[]> {
  try {
    const response = await fetch('/objecttypes')
    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`)
    }
    const contentType = response.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      throw new Error('Incorrect content type in response of ObjectTypes API call')
    }
    const responseContent = (await response.json()) as PaginatedObjectTypeList
    return responseContent.results
  } catch (error) {
    throw error
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
