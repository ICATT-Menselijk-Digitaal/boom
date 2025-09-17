<script setup lang="ts">
import router from '@/router'
import { csvData, isMappingSaved, mapping, selectedObjectVersion } from '@/store'

/**
 * Handles the return button click
 * Navigates back to the mapping page and resets the navigation state.
 */
function returnHandler() {
  router.push('/mapping')
  isMappingSaved.value = false
}
</script>

<template>
  <main class="flex column">
    <h1>Now let's preview!</h1>
    <div class="flex column box">
      <div class="flex column">
        <h2>Result of Mapping</h2>
        <p>
          Here you see the result of mapping the Object-type properties to the CSV header names:
        </p>
        <pre>{{ mapping }}</pre>
      </div>
      <h2>Mapping preview</h2>

      <table>
        <caption>
          Here you see a preview of the mapping using the first row of the CSV data:
        </caption>
        <thead>
          <tr>
            <th
              v-for="(propertyName, index) in Object.keys(
                selectedObjectVersion?.jsonSchema?.properties || {},
              )"
              :key="index"
            >
              {{ propertyName }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              v-for="(propertyName, index) in Object.keys(
                selectedObjectVersion?.jsonSchema?.properties || {},
              )"
              :key="index"
            >
              {{ csvData?.data.at(0)?.[mapping[propertyName]] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex row">
      <button @click="$router.push('/')">Accept</button>
      <button @click="returnHandler">Return</button>
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
