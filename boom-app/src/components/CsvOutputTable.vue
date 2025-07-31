<script setup lang="ts">
import type { CsvOutput } from '@/types'

defineProps<{
  csvData: CsvOutput | undefined
}>()
</script>

<template>
  <table>
    <caption>
      An organized view of your uploaded CSV data.
    </caption>
    <thead>
      <tr>
        <th v-for="(headerName, index) in csvData?.headers" :key="index">
          {{ headerName }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in csvData?.data" :key="index">
        <td v-for="(headerName, index) in csvData?.headers" :key="index">
          {{ item[headerName] }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
h2 {
  text-align: center;
}
table {
  width: 100%;
  column-span: all;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

th {
  font-weight: bold;
  font-size: large;
}
</style>
