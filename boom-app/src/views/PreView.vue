<script setup lang="ts">
import { csvData, mapping, selectedObjectType } from '@/store'
</script>

<template>
  <main>
    <h1>Now let's preview!</h1>
    <div class="flex column box">
      <h2>Mapping preview</h2>
      <table>
        <caption>
          Here you see a preview of the mapping using the first row of the data from the uploaded
          CSV file:
        </caption>
        <thead>
          <tr>
            <th
              v-for="(propertyName, index) in Object.keys(selectedObjectType?.properties || {})"
              :key="index"
            >
              {{ propertyName }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              v-for="(propertyName, index) in Object.keys(selectedObjectType?.properties || {})"
              :key="index"
            >
              {{ csvData?.data[0][mapping[propertyName]] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
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
