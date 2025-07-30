<script setup lang="ts">
import CsvOutputTable from '@/components/CsvOutputTable.vue'
import SelectObjectType from '@/components/SelectObjectType.vue'

const exampleHeaderNames = ['Naam', 'Adres'] // Example header names
const csvData = {
  headers: exampleHeaderNames,
  data: [],
}
</script>

<template>
  <main>
    <h1>Ok let's Map!</h1>
    <div class="mapping-component">
      <SelectObjectType />
      <div class="header-names-box">
        <h2>Header Names</h2>
        <CsvOutputTable :csvData="csvData" :showOnlyHeaders="true" />
      </div>
    </div>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
.mapping-component {
  display: flex;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.header-names-box {
  margin-left: 20px;
  flex-grow: 1;
}
</style>
