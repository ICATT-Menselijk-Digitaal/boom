<script setup lang="ts">
import SelectList from '@/components/SelectList.vue'
import SelectObjectType from '@/components/SelectObjectType.vue'
import { ref } from 'vue'

const exampleHeaderNames = ['Naam', 'Adres'] // Example header names
const csvData = {
  headers: exampleHeaderNames,
  data: [],
}
const objectList = {
  '': { properties: {} },
  Smoel: { properties: { naam: { type: 'string' }, adres: { type: 'string' } } },
  Boom: { properties: { naam: { type: 'string' }, coordinaten: { type: 'string' } } },
  Betonpaal: { properties: { naam: { type: 'string' } } },
}

const mappedNames = ref<Record<string, string>>({}) // Object to hold header names for each object type

const selectedObjectType = ref<string>('')
const selectedObjectTypeName = ref<string>('')

function assignHeaderName(headerName: string) {
  mappedNames.value[selectedObjectTypeName.value] = headerName
  console.log(
    `Assigned header "${headerName}" to object attribute "${selectedObjectTypeName.value}"`,
  )
}
</script>

<template>
  <main>
    <h1>Ok let's Map!</h1>
    <SelectObjectType
      :objectList="Object.keys(objectList)"
      @selectionChange="(selection: string) => (selectedObjectType = selection)"
    />
    <div class="mapping-component">
      <SelectList
        :data="Object.keys(objectList[selectedObjectType as keyof typeof objectList].properties)"
        :title="'ObjectType'"
        @selectionChange="(objectTypeName: string) => (selectedObjectTypeName = objectTypeName)"
      />
      <SelectList
        :data="csvData.headers"
        :title="'Headers'"
        @selectionChange="(headerName: string) => assignHeaderName(headerName)"
      />
    </div>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
.mapping-component {
  display: flex;
  flex-direction: row;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
</style>
