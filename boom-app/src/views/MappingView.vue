<script setup lang="ts">
import MappingRow from '@/components/MappingRow.vue'
import {
  createMapping,
  getObjectTypeByName,
  getObjectTypeNames,
  getObjectTypePropertyNames,
} from '@/helpers'
import {
  exampleObjects,
  mapping,
  selectedObjectTypeName,
  selectedObjectType,
  csvData,
} from '@/store'
import { computed, watch } from 'vue'

const isObjectSelected = computed(() => {
  return selectedObjectTypeName.value !== ''
})

// Create an automatic mapping when the selected object type is changed/selected.
watch(selectedObjectTypeName, (newValue) => {
  mapping.value = createMapping(
    getObjectTypeByName(exampleObjects, newValue || ''),
    csvData.value.headers,
  )
})
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
      <form id="mapping-form" class="flex column" @submit.prevent="$router.push('/preview')">
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
