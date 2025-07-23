<script setup lang="ts">
import type { CsvOutput } from '@/types'

defineProps<{ csvData: CsvOutput | undefined }>()
</script>

<template>
  <h1>Observe that uploaded data!</h1>
  <div class="data-box">
    <table>
      <tr>
        <th v-for="(headerName, index) in csvData?.headers" :key="index">
          {{ headerName }}
        </th>
      </tr>
      <tr v-for="(item, index) in csvData?.data" :key="index">
        <td v-for="(headerName, index) in csvData?.headers" :key="index">
          {{ item[headerName] }}
        </td>
      </tr>
    </table>
  </div>
</template>

<style scoped>
h1 {
  text-align: center;
}
.data-box {
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
