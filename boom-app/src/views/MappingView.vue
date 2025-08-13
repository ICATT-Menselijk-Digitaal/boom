<script setup lang="ts">
import SelectObjectType from '@/components/SelectObjectType.vue'
import { ref } from 'vue'

// Example header names
const exampleHeaderNames = ['Naam', 'Adres']

const objectList = {
  '': { properties: {} },
  Smoel: { properties: { naam: { type: 'string' }, adres: { type: 'string' } } },
  Boom: { properties: { naam: { type: 'string' }, coordinaten: { type: 'string' } } },
  Betonpaal: { properties: { naam: { type: 'string' } } },
}

const selectedObjectType = ref()
</script>

<template>
  <main>
    <h1>Ok let's Map!</h1>
    <div class="selection-component box">
      <h2>Select Object Type</h2>
      <SelectObjectType v-model="selectedObjectType" :objectNamesList="Object.keys(objectList)" />
    </div>
    <div class="mapping-component box"></div>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
.mapping-component {
  display: flex;
  flex-direction: row;
}
.selection-component {
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
