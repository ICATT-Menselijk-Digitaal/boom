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
const mapping = ref<Record<string, string>>({})

watch(selectedObjectTypeName, (newValue) => {
  mapping.value = createMapping(
    getObjectTypeByName(exampleObjects, newValue || ''),
    exampleHeaderNames,
  )
})

/**
 * Add or update the mapping for the selected object type and header name.
 * @param objectTypeName string representing the object type name
 * @param selectedHeaderName string representing the selected header name
 */
function updateMapping(objectTypeName: string, selectedHeaderName: string) {
  mapping.value[objectTypeName] = selectedHeaderName ?? ''
}
</script>

<template>
  <main>
    <h1>Ok let's Map!</h1>
    <div class="column-box box">
      <h2>Select Object Type</h2>
      <SelectObjectType
        v-model="selectedObjectTypeName"
        :objectNamesList="getObjectTypeNames(exampleObjects)"
      />
    </div>
    <div class="column-box box">
      <MappingRow
        v-for="objectTypeName in getObjectTypePropertyNames(
          getObjectTypeByName(exampleObjects, selectedObjectTypeName || ''),
        )"
        :key="objectTypeName"
        :objectTypeName="objectTypeName"
        :headerNames="exampleHeaderNames"
        @updateSelectedHeaderName="updateMapping"
      />
    </div>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
.column-box {
  display: flex;
  flex-direction: column;
}
.box {
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
</style>
