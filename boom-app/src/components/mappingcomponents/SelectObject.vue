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
const objectTypes = ['Smoel', 'Boom', 'Betonpaal'] // Example object types
const objectList = {
  '': { properties: {} },
  Smoel: smoelJSONSchema,
  Boom: { properties: { naam: { type: 'string' }, coordinaten: { type: 'string' } } },
  Betonpaal: { properties: { naam: { type: 'string' } } },
}
const selectedObjectType = ref('') // Selected object type
</script>

<template>
  <label>Selecteer object-type</label>
  <select v-model="selectedObjectType">
    <option value="" disabled>Object-type</option>
    <option v-for="oType in objectTypes" :key="oType">
      {{ oType }}
    </option>
  </select>
  <div class="object-dsplay-box">
    <h3>Object JSON Schema</h3>
    <!-- <span>{{ objectType }}</span> -->
    <p
      v-for="(_, key) in objectList[selectedObjectType as keyof typeof objectList].properties"
      v-bind:key="key"
    >
      {{ key }}
    </p>
  </div>
</template>

<style scoped>
.object-dsplay-box {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
</style>
