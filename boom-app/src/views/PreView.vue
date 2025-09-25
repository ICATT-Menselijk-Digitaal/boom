<script setup lang="ts">
import { convertDataToObjects, createNewObject, searchObject } from '@/helpers'
import router from '@/router'
import {
  csvData,
  isMappingSaved,
  isEntryDone,
  mapping,
  selectedObjectVersion,
  errors,
  entries,
} from '@/store'
import type { MappedRecord } from '@/types'

/**
 * Handles the accept button click.
 * Enters all the data into the database.
 * Changes the preview to show any errors.
 */
async function acceptHandler() {
  const newObjects: MappedRecord[] = convertDataToObjects(csvData.value, mapping.value)
  for (const newObject of newObjects) {
    const isDuplicate = await searchObject(newObject)
    if (!isDuplicate) {
      await createNewObject(
        selectedObjectVersion.value?.objectType ?? '',
        selectedObjectVersion.value?.version ?? 0,
        newObject,
      ).catch((error) => errors.value.push(error))
      entries.value.push(newObject)
    }
  }
  isEntryDone.value = true
}

/**
 * Handles the return button click
 * Navigates back to the mapping page and resets states so the mapping can be changed.
 */
function returnHandler() {
  router.push('/mapping')
  isMappingSaved.value = false
  mapping.value = {}
  isEntryDone.value = false
  errors.value = []
  entries.value = []
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
        <table>
          <thead>
            <tr>
              <th>Header name</th>
              <th>maps to</th>
              <th>Property name</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(propertyName, headerName) in mapping" :key="headerName">
              <td>{{ headerName }}</td>
              <td>-</td>
              <td>{{ propertyName }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h2>Entry preview</h2>

      <table>
        <caption>
          Here you see a preview of the mapping using the first row of the CSV data:
        </caption>
        <thead>
          <tr>
            <th
              v-for="(_, propertyName) in convertDataToObjects(csvData, mapping).at(0)"
              :key="propertyName"
            >
              {{ propertyName }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td v-for="value in convertDataToObjects(csvData, mapping).at(0)" :key="value">
              {{ value }}
            </td>
          </tr>
        </tbody>
      </table>
      <h2>Satisfied?</h2>
      <p>
        If you are satisfied with the mapping, press accept to enter all the new objects into the
        database.
      </p>
    </div>
    <div v-if="isEntryDone" class="flex column box">
      <h2>Done!</h2>
      <p>{{ entries.length }} new entries have been succesfully completed!</p>
      <h2>Errors</h2>
      <p>{{ errors.length }} entries have run into an error</p>
    </div>
    <div class="flex row">
      <button v-if="!isEntryDone" @click="acceptHandler">Accept</button>
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
  font-size: large;
  text-align: start;
}
</style>
