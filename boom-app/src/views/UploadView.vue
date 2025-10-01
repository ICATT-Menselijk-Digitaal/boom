<script setup lang="ts">
import type { CsvOutput, ObjectTypeMetaData, PaginateObjectTypeResponse } from '@/types'
import CsvUploadForm from '@/components/CsvUploadForm.vue'
import {
  csvData,
  isUploaded,
  objectTypesMetaDataList,
  selectedObjectType,
  selectedObjectVersion,
} from '@/store'
import router from '@/router'
import { fetchObjectTypeData } from '@/helpers'

/**
 * Handles the 'fileParsed' event:
 * - fetches the ObjectTypes meta data
 * - saves the CsvOutput data to pass that to the DisplayComponent.
 * - routes to /mapping
 * @param {CsvOutput} receivedData - The parsed CSV data.
 */
async function handleFileParsed(receivedData: CsvOutput) {
  objectTypesMetaDataList.value = await fetchObjectTypes()
  csvData.value = receivedData
  // Required for a reset when a new file is uploaded mid mapping.
  selectedObjectType.value = undefined
  selectedObjectVersion.value = undefined
  router.push('/mapping')
}

/**
 * Fetches the list of ObjectTypes
 * @returns A Promise that is a list of ObjectType meta data
 */
async function fetchObjectTypes(): Promise<ObjectTypeMetaData[]> {
  let returnList: ObjectTypeMetaData[] = []
  await fetchObjectTypeData('/objecttypes')
    .then((objectTypeList) => {
      returnList = objectTypeList.results
    })
    .catch((error) => console.error(`Error during fetching of the list of ObjectTypes${error}`))
  return returnList
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
