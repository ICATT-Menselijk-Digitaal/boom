<script setup lang="ts">
import type { CsvOutput } from '@/types'
import { ref } from 'vue'

const { showOnlyHeaders = false } = defineProps<{
  csvData: CsvOutput | undefined
  showOnlyHeaders?: boolean
}>()
const selectedIndex = ref<number | null>(null)

function selectOption(index: number) {
  selectedIndex.value = index
}
</script>

<template>
  <table>
    <caption>
      An organized view of your uploaded CSV data.
    </caption>
    <thead v-if="!showOnlyHeaders">
      <tr>
        <th v-for="(headerName, index) in csvData?.headers" :key="index">
          {{ headerName }}
        </th>
      </tr>
    </thead>
    <ul class="selectable-list" v-else>
      <li
        v-for="(headerName, index) in csvData?.headers"
        :key="index"
        :class="{ selected: selectedIndex === index }"
        @click="selectOption(index)"
      >
        {{ headerName }}
      </li>
    </ul>
    <tbody v-if="!showOnlyHeaders">
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
.selectable-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.selectable-list li {
  padding: 10px 16px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  transition: background 0.2s;
}
.selectable-list li.selected {
  background: #d0ebff;
  font-weight: bold;
}
.selectable-list li:hover {
  background: #f1f3f5;
}
</style>
