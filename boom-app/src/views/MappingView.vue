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
  isMapping,
  mapping,
  selectedObjectTypeName,
  selectedObjectType,
} from '@/store'
import { computed, watch } from 'vue'

// Temporary placeholders for data
const exampleHeaderNames = ['name', 'address']

const isObjectSelected = computed(() => {
  return selectedObjectTypeName.value !== ''
})

// Create an automatic mapping when the selected object type is changed/selected.
watch(selectedObjectTypeName, (newValue) => {
  mapping.value = createMapping(
    getObjectTypeByName(exampleObjects, newValue || ''),
    exampleHeaderNames,
  )
})

/**
 * Resets the mapping state and starts the view at select object type.
 */
function resetMapping() {
  selectedObjectTypeName.value = ''
  mapping.value = {}
  isMapping.value = true
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
    <div v-if="isMapping && isObjectSelected" class="flex column box">
      <h2>Map properties to header names</h2>
      <p>For each object type property, select the CSV header name that matches it.</p>
      <form class="flex column" @submit.prevent="isMapping = false">
        <MappingRow
          v-for="objectTypePropertyName in getObjectTypePropertyNames(selectedObjectType)"
          :key="objectTypePropertyName"
          :objectTypePropertyName="objectTypePropertyName"
          :headerNames="exampleHeaderNames"
          :required="selectedObjectType?.required?.includes(objectTypePropertyName)"
          v-model="mapping[objectTypePropertyName]"
        />
        <button type="submit">Save Mapping</button>
      </form>
    </div>
    <div v-if="!isMapping && isObjectSelected" class="flex column box">
      <h2>Result of Mapping</h2>
      <pre>{{ mapping }}</pre>
      <div class="flex row">
        <button @click="isMapping = true">Edit Mapping</button>
        <button @click="resetMapping">Reset mapping</button>
      </div>
    </div>
    <button v-if="!isMapping && isObjectSelected" @click="$router.push('/preview')">Next</button>
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
