<script setup lang="ts">
import MappingRow from '@/components/MappingRow.vue'
import { createMapping, getObjectTypeNames, getObjectTypePropertyNames } from '@/helpers'
import router from '@/router'
import {
  exampleObjects,
  mapping,
  selectedObjectTypeName,
  selectedObjectType,
  csvData,
  isMappingSaved,
} from '@/store'
import type { APIObjectType, ObjectType } from '@/types'
import { computed, ref, watch } from 'vue'

const objectTypes = ref<ObjectType[]>([])
const isObjectSelected = computed(() => {
  return selectedObjectTypeName.value !== ''
})
watch(selectedObjectType, () => {
  mapping.value = createMapping(selectedObjectType.value, csvData.value.headers)
  isMappingSaved.value = false
})

/**
 * Handles the form submission
 * Navigates to the preview page and updates the navigation state.
 */
function submitHandler() {
  router.push('/preview')
  isMappingSaved.value = true
}

async function fetchObjectTypes() {
  await fetch('objecttypes-api/objecttypes')
    .then((response) => response.json())
    .then((data) => data.results)
    .then((results: APIObjectType[]) => {
      objectTypes.value = results.map((obj: APIObjectType) => {
        return {
          title: obj.name,
          uuid: obj.uuid,
          versionNumber: obj.versions.length,
          type: 'object',
          properties: {},
        }
      })
    })
  await fetch(
    `objecttypes-api/objecttypes/${objectTypes.value.at(0)?.uuid}/versions/${objectTypes.value.at(0)?.versionNumber}`,
  )
    .then((response) => response.json())
    .then((data) => console.log(data.jsonSchema.properties))
}
</script>

<template>
  <main class="flex column">
    <h1>Ok let's Map!</h1>
    <div class="flex column box">
      <h2>Select Object Type</h2>
      <p>Select an object type from the list below that you want to use.</p>
      <div class="flex row">
        <label for="selectObjectType">Object type</label>
        <select id="selectObjectType" v-model="selectedObjectTypeName">
          <option v-for="objectType in getObjectTypeNames(exampleObjects)" :key="objectType">
            {{ objectType }}
          </option>
        </select>
      </div>
    </div>
    <div v-if="isObjectSelected" class="flex column box">
      <h2>Map properties to header names</h2>
      <p>For each object type property, select the CSV header name that matches it.</p>
      <form id="mapping-form" class="flex column" @submit.prevent="submitHandler">
        <MappingRow
          v-for="objectTypePropertyName in getObjectTypePropertyNames(selectedObjectType)"
          :key="objectTypePropertyName"
          :objectTypePropertyName="objectTypePropertyName"
          :headerNames="csvData.headers"
          :required="selectedObjectType?.required?.includes(objectTypePropertyName)"
          v-model="mapping[objectTypePropertyName]"
        />
      </form>
    </div>
    <button v-if="isObjectSelected" type="submit" form="mapping-form">Save mapping</button>
    <button @click="fetchObjectTypes">Fetch</button>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
button {
  align-self: flex-start;
}
</style>
