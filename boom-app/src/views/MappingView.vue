<script setup lang="ts">
import MappingRow from '@/components/MappingRow.vue'
import SelectObjectType from '@/components/SelectObjectType.vue'
import {
  createMapping,
  getObjectTypeByName,
  getObjectTypeNames,
  getObjectTypePropertyNames,
} from '@/helpers'
import type { ObjectType } from '@/types'
import { ref, watch } from 'vue'

// Example header names
const exampleHeaderNames = ['name', 'address']

const exampleObjects: ObjectType[] = [
  {
    title: 'Boom',
    type: 'object',
    properties: { name: { type: 'string' }, location: { type: 'string' } },
  },
  {
    title: 'Smoel',
    type: 'object',
    properties: {
      firstname: { type: 'string' },
      lastname: { type: 'string' },
      address: { type: 'string' },
    },
  },
]
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
      <SelectObjectType
        v-model="selectedObjectTypeName"
        :objectNamesList="getObjectTypeNames(exampleObjects)"
      />
    </div>
    <div v-if="isMapping && isObjectSelected" class="flex column box">
      <h2>Map properties to header names</h2>
      <p>For each object type property, select the CSV header name that matches it.</p>
      <MappingRow
        v-for="objectTypeName in getObjectTypePropertyNames(
          getObjectTypeByName(exampleObjects, selectedObjectTypeName || ''),
        )"
        :key="objectTypeName"
        :objectTypeName="objectTypeName"
        :headerNames="exampleHeaderNames"
        v-model="mapping[objectTypeName]"
        @updateSelectedHeaderName="updateMapping"
      />
      <button @click="isMapping = false">Save Mapping</button>
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
