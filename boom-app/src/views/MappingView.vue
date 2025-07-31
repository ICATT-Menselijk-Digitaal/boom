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

const mappedAttributes = ref<Map<string, string>>(new Map<string, string>())

const selectedObjectType = ref<string>('')
const selectedObjectTypeAttribute = ref<string>('')

function headerSelectionChangeHandler(headerName: string) {
  // Registreer de geselecteerd header naam
}
function objectSelectionChangeHandler(objectTypeAttribute: string) {
  // Registreer het geselecteerde object-type attribuut
  selectedObjectTypeAttribute.value = objectTypeAttribute
}
function objectTypeChangeHandler(objectType: keyof typeof objectList) {
  // Registeer het geselecteerd object-type
  selectedObjectType.value = objectType
  // Laad de map met alle object-type attributen die gemapped moeten worden
}
</script>

<template>
  <main>
    <h1>Ok let's Map!</h1>
    <div class="mapping-component">
      <SelectObjectType
        :objectList="Object.keys(objectList)"
        @selectionChange="objectTypeChangeHandler"
      />
    </div>
    <div class="mapping-component">
      <SelectList
        :data="Object.keys(objectList[selectedObjectType as keyof typeof objectList].properties)"
        :title="'ObjectType'"
        :mapping="mappedAttributes"
        @selectionChange="objectSelectionChangeHandler"
      />
      <SelectList
        :data="csvData.headers"
        :title="'Headers'"
        :mapping="mappedAttributes"
        :key="selectedObjectTypeAttribute"
        @selectionChange="headerSelectionChangeHandler"
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
