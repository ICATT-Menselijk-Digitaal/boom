<script setup lang="ts">
import MappingRow from '@/components/MappingRow.vue'
import {
  createMapping,
  getObjectTypeByName,
  getObjectTypeNames,
  getObjectTypePropertyNames,
} from '@/helpers'
import type { ObjectType } from '@/types'
import { computed, ref, watch } from 'vue'

// Temporary placeholders for data
const exampleHeaderNames = ['name', 'address']
const exampleObjects: ObjectType[] = [
  {
    title: 'Boom',
    type: 'object',
    properties: { name: { type: 'string' }, location: { type: 'string' } },
    required: ['name', 'location'],
  },
  {
    title: 'Smoel',
    type: 'object',
    properties: {
      firstname: { type: 'string' },
      lastname: { type: 'string' },
      address: { type: 'string' },
    },
    required: ['firstname'],
  },
]
const selectedObjectType = computed(() => {
  return getObjectTypeByName(exampleObjects, selectedObjectTypeName.value || '')
})
const selectedObjectTypeName = ref<string>()
const mapping = ref<Record<string, string>>({}) // key: object type name, value: header name
const isObjectSelected = ref(false)
const isMapping = ref(true)

// Create an automatic mapping when the selected object type is changed/selected.
watch(selectedObjectTypeName, (newValue) => {
  mapping.value = createMapping(
    getObjectTypeByName(exampleObjects, newValue || ''),
    exampleHeaderNames,
  )
  isObjectSelected.value = newValue !== ''
})

/**
 * Add or update the mapping for the selected object type and header name.
 * @param objectTypeName string representing the object type name
 * @param selectedHeaderName string representing the selected header name
 */
function updateMapping(objectTypeName: string, selectedHeaderName: string) {
  mapping.value[objectTypeName] = selectedHeaderName ?? ''
}

/**
 * Resets the mapping state and starts the view at select object type.
 */
function resetMapping() {
  selectedObjectTypeName.value = ''
  mapping.value = {}
  isObjectSelected.value = false
  isMapping.value = true
}
</script>

<template>
  <main>
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
          :required="selectedObjectType.required?.includes(objectTypePropertyName)"
          v-model="mapping[objectTypePropertyName]"
          @updateSelectedHeaderName="updateMapping"
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
