<script setup lang="ts">
import type { CsvOutput } from '@/types'

defineProps<{
  csvData: CsvOutput | undefined
}>()
</script>

<template>
  <div class="flex column box">
    <h2>Your uploaded data</h2>
    <table>
      <caption>
        A preview of your uploaded CSV data:
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
  </div>
</template>

<style scoped>
table {
  width: 100%;
  column-span: all;
  max-width: 600px;
}

caption {
  text-align: start;
}

th {
  font-weight: bold;
  font-size: large;
  text-align: start;
}
</style>
