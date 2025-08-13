<script setup lang="ts">
import MappingRow from '@/components/MappingRow.vue'
import SelectObjectType from '@/components/SelectObjectType.vue'
import { getObjectTypeByName, getObjectTypeNames, getObjectTypePropertyNames } from '@/helpers'
import type { ObjectType } from '@/types'
import { ref } from 'vue'

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
    properties: { name: { type: 'string' }, address: { type: 'string' } },
  },
]
const selectedObjectTypeName = ref()
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
          getObjectTypeByName(exampleObjects, selectedObjectTypeName),
        )"
        :key="objectTypeName"
        :objectTypeName="objectTypeName"
        :headerNames="exampleHeaderNames"
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
