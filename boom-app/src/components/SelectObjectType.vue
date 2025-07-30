<script setup lang="ts">
import { ref } from 'vue'

const smoelJSONSchema = {
  $schema: 'http://json-schema.org/draft/2020-12/schema',
  title: 'Voorbeeld Smoel object',
  description: 'Een voorbeeld van een Smoel object met JSON Schema.',
  type: 'object',
  properties: {
    naam: { type: 'string', description: 'De naam van de persoon.' },
    adres: { type: 'string' },
  },
}
const objectList = {
  '': { properties: {} },
  Smoel: smoelJSONSchema,
  Boom: { properties: { naam: { type: 'string' }, coordinaten: { type: 'string' } } },
  Betonpaal: { properties: { naam: { type: 'string' } } },
}
const selectedObjectType = ref<keyof typeof objectList>('') // Selected object type
</script>

<template>
  <div class="wrapper">
    <label for="selectObjectType">Select an object-type</label>
    <select id="selectObjectType" v-model="selectedObjectType">
      <option v-for="oType in Object.keys(objectList)" :key="oType">
        {{ oType }}
      </option>
    </select>
    <div class="object-display-box">
      <h3>Object JSON Schema</h3>
      <p v-for="(_, key) in objectList[selectedObjectType].properties" v-bind:key="key">
        {{ key }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  margin: 0 1em;
}
.object-display-box {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  min-height: 10em;
}
</style>
